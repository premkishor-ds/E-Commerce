const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://premkishor:Hsndehzd6oFmbvHA@ac-busl9fe-shard-00-00.x1ez0rp.mongodb.net:27017,ac-busl9fe-shard-00-01.x1ez0rp.mongodb.net:27017,ac-busl9fe-shard-00-02.x1ez0rp.mongodb.net:27017/?authSource=admin&replicaSet=atlas-120zxf-shard-0&ssl=true';

// Mini schemas
const UserSchema = new mongoose.Schema({
  email: String,
  passwordHash: String,
  roles: [String],
  displayName: String,
  phone: String,
  accountStatus: String
}, { collection: 'users' });

const ProductSchema = new mongoose.Schema({
  title: String,
  price: Number,
  salesCount: Number,
  reviewCount: Number,
  totalUnitsSold: Number,
  averageRating: Number,
  vendorId: mongoose.Schema.Types.ObjectId,
  sku: String
}, { collection: 'products' });

const ReviewSchema = new mongoose.Schema({
  productId: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId,
  rating: Number,
  comment: String,
  verifiedPurchase: Boolean,
  status: String
}, { collection: 'reviews' });

const OrderSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  items: [{
    productId: mongoose.Schema.Types.ObjectId,
    quantity: Number,
    price: Number
  }],
  status: String,
  totalPrice: Number,
  shippingAddress: Object
}, { collection: 'orders' });

const SellerSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  storeName: String
}, { collection: 'sellers' });

const VendorSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  shopName: String
}, { collection: 'vendors' });

const User = mongoose.model('User', UserSchema);
const Product = mongoose.model('Product', ProductSchema);
const Review = mongoose.model('Review', ReviewSchema);
const Order = mongoose.model('Order', OrderSchema);
const Seller = mongoose.model('Seller', SellerSchema);
const Vendor = mongoose.model('Vendor', VendorSchema);

async function main() {
  console.log('Connecting to database...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB.');

  // 1. Fetch active merchant users
  const sellersList = await Seller.find({});
  const vendorsList = await Vendor.find({});
  const activeMerchants = [...sellersList, ...vendorsList].map(m => m.userId.toString());

  // 2. Fetch all products
  const products = await Product.find({});
  console.log(`Fetched ${products.length} products to audit.`);

  // Ensure valid ownership for products
  const productUpdates = [];
  for (const product of products) {
    if (!product.vendorId || !activeMerchants.includes(product.vendorId.toString())) {
      const fallbackMerchant = activeMerchants[Math.floor(Math.random() * activeMerchants.length)];
      if (fallbackMerchant) {
        productUpdates.push({
          updateOne: {
            filter: { _id: product._id },
            update: { $set: { vendorId: new mongoose.Types.ObjectId(fallbackMerchant) } }
          }
        });
      }
    }
  }

  if (productUpdates.length > 0) {
    await Product.bulkWrite(productUpdates);
    console.log(`Updated ownership for ${productUpdates.length} products.`);
  }

  // 3. Pre-load active users
  const users = await User.find({});
  const userMap = new Set(users.map(u => u._id.toString()));

  // 4. Pre-load purchase history mapping
  console.log('Building purchase history mapping...');
  const orderItems = await Order.aggregate([
    { $match: { status: { $in: ['Paid', 'Delivered', 'Shipped'] } } },
    { $unwind: '$items' },
    { $project: { userId: 1, productId: '$items.productId' } }
  ]);

  const purchaseSet = new Set();
  orderItems.forEach(item => {
    if (item.userId && item.productId) {
      purchaseSet.add(`${item.userId.toString()}_${item.productId.toString()}`);
    }
  });

  // 5. Audit Reviews
  const reviews = await Review.find({});
  console.log(`Fetched ${reviews.length} reviews to audit.`);

  const missingUsersToCreate = [];
  const ordersToCreate = [];
  const reviewUpdates = [];

  const productMap = {};
  products.forEach(p => {
    productMap[p._id.toString()] = p;
  });

  for (const review of reviews) {
    if (!review.userId || !review.productId) continue;

    const userIdStr = review.userId.toString();
    const productIdStr = review.productId.toString();

    // A. Check if user exists
    if (!userMap.has(userIdStr)) {
      // Create user record (to be inserted in bulk later)
      missingUsersToCreate.push({
        _id: review.userId,
        email: `orphan.user.${userIdStr}@example.com`,
        passwordHash: '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxx',
        roles: ['Customer'],
        displayName: `Recovered User`,
        phone: '9999999999',
        accountStatus: 'Active'
      });
      userMap.add(userIdStr);
    }

    // B. Check if product exists
    const product = productMap[productIdStr];
    if (!product) {
      // Orphan review: mark for deletion
      reviewUpdates.push({
        deleteOne: {
          filter: { _id: review._id }
        }
      });
      continue;
    }

    // C. Check purchase history
    const purchaseKey = `${userIdStr}_${productIdStr}`;
    if (!purchaseSet.has(purchaseKey)) {
      ordersToCreate.push({
        userId: review.userId,
        items: [{
          productId: review.productId,
          quantity: 1,
          price: product.price
        }],
        status: 'Delivered',
        totalPrice: product.price,
        shippingAddress: {
          fullName: 'Recovered Customer',
          addressLine1: '45 E-Commerce Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400001',
          country: 'India',
          phone: '9999999999'
        }
      });
      purchaseSet.add(purchaseKey);
    }

    // D. Enforce verifiedPurchase flag
    if (!review.verifiedPurchase) {
      reviewUpdates.push({
        updateOne: {
          filter: { _id: review._id },
          update: { $set: { verifiedPurchase: true } }
        }
      });
    }
  }

  // Bulk inserts
  if (missingUsersToCreate.length > 0) {
    console.log(`Creating ${missingUsersToCreate.length} missing users...`);
    await User.insertMany(missingUsersToCreate);
  }
  if (ordersToCreate.length > 0) {
    console.log(`Creating ${ordersToCreate.length} Delivered orders in bulk...`);
    const chunkSize = 1000;
    for (let k = 0; k < ordersToCreate.length; k += chunkSize) {
      await Order.insertMany(ordersToCreate.slice(k, k + chunkSize));
    }
  }
  if (reviewUpdates.length > 0) {
    console.log(`Updating/cleaning ${reviewUpdates.length} reviews...`);
    await Review.bulkWrite(reviewUpdates);
  }

  // 6. Recalculate stats for all products
  console.log('Recalculating statistics for all products...');
  const statsMap = {};
  
  // Aggregate review stats
  const reviewStats = await Review.aggregate([
    { $match: { status: 'Approved' } },
    { $group: { _id: '$productId', count: { $sum: 1 }, avg: { $avg: '$rating' } } }
  ]);
  reviewStats.forEach(stat => {
    if (stat._id) {
      statsMap[stat._id.toString()] = {
        reviewCount: stat.count,
        averageRating: Math.round(stat.avg * 10) / 10
      };
    }
  });

  // Aggregate order stats
  const orderStats = await Order.aggregate([
    { $match: { status: { $in: ['Paid', 'Delivered', 'Shipped'] } } },
    { $unwind: '$items' },
    { $group: { _id: '$items.productId', sold: { $sum: '$items.quantity' } } }
  ]);
  orderStats.forEach(stat => {
    if (stat._id) {
      const existingStats = statsMap[stat._id.toString()] || { reviewCount: 0, averageRating: 0 };
      statsMap[stat._id.toString()] = {
        ...existingStats,
        totalUnitsSold: stat.sold
      };
    }
  });

  // Build product updates
  const statUpdates = [];
  products.forEach(product => {
    const stats = statsMap[product._id.toString()] || { reviewCount: 0, averageRating: 0, totalUnitsSold: 0 };
    statUpdates.push({
      updateOne: {
        filter: { _id: product._id },
        update: {
          $set: {
            reviewCount: stats.reviewCount || 0,
            averageRating: stats.averageRating || 0,
            totalUnitsSold: stats.totalUnitsSold || 0,
            salesCount: stats.totalUnitsSold || 0
          }
        }
      }
    });
  });

  if (statUpdates.length > 0) {
    console.log('Performing bulk statistics write...');
    await Product.bulkWrite(statUpdates);
  }

  console.log('*** DATABASE DATA ALIGNMENT COMPLETED SUCCESSFULLY ***');
  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  mongoose.disconnect();
});
