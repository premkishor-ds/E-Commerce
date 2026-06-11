const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://premkishor:Hsndehzd6oFmbvHA@ac-busl9fe-shard-00-00.x1ez0rp.mongodb.net:27017,ac-busl9fe-shard-00-01.x1ez0rp.mongodb.net:27017,ac-busl9fe-shard-00-02.x1ez0rp.mongodb.net:27017/?authSource=admin&replicaSet=atlas-120zxf-shard-0&ssl=true';

// Mini schemas
const UserSchema = new mongoose.Schema({
  email: String,
  displayName: String,
  phone: String
}, { collection: 'users' });

const ProductSchema = new mongoose.Schema({
  title: String,
  price: Number,
  salesCount: Number
}, { collection: 'products' });

const OrderSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  items: Array,
  status: String,
  totalPrice: Number,
  shippingAddress: Object
}, { collection: 'orders' });

const User = mongoose.model('User', UserSchema);
const Product = mongoose.model('Product', ProductSchema);
const Order = mongoose.model('Order', OrderSchema);

async function main() {
  console.log('Connecting to database...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB Atlas.');

  // Fetch seed customers
  const customers = await User.find({ email: /customer\.seed\./ });
  if (customers.length === 0) {
    console.log('No seed customers found. Please seed customers first.');
    await mongoose.disconnect();
    return;
  }
  console.log(`Found ${customers.length} seed customers.`);

  // Fetch all products
  const products = await Product.find({});
  console.log(`Found ${products.length} products.`);

  // We will designate the first 15 products to have "high sales volume" (~400 to 450 orders)
  // And the rest will have normal sales volume (~5 to 15 orders, which we already have, but we will sync them)
  const highVolumeCount = 15;
  const ordersToInsert = [];
  const productUpdates = [];

  // Clear existing orders for the high-volume products to avoid inflating indefinitely
  const highVolumeProductIds = products.slice(0, highVolumeCount).map(p => p._id);
  console.log('Clearing old orders for high-volume products...');
  await Order.deleteMany({ 'items.productId': { $in: highVolumeProductIds } });

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    
    if (i < highVolumeCount) {
      // Seed 410 to 440 orders for this product
      const targetOrders = 410 + Math.floor(Math.random() * 30);
      console.log(`Seeding ${targetOrders} orders for high-volume product: ${product.title}`);
      
      for (let j = 0; j < targetOrders; j++) {
        const customer = customers[j % customers.length];
        ordersToInsert.push({
          userId: customer._id,
          items: [{
            productId: product._id,
            quantity: 1,
            price: product.price
          }],
          status: 'Paid',
          totalPrice: product.price,
          shippingAddress: {
            fullName: customer.displayName,
            addressLine1: '123 E-Commerce Way',
            city: 'Mumbai',
            state: 'Maharashtra',
            postalCode: '400001',
            country: 'India',
            phone: customer.phone
          }
        });
      }
      
      productUpdates.push({
        updateOne: {
          filter: { _id: product._id },
          update: { $set: { salesCount: targetOrders } }
        }
      });
    } else {
      // Sync salesCount with the actual number of orders in the database for other products
      const count = await Order.countDocuments({ 'items.productId': product._id, status: 'Paid' });
      productUpdates.push({
        updateOne: {
          filter: { _id: product._id },
          update: { $set: { salesCount: count } }
        }
      });
    }
  }

  if (ordersToInsert.length > 0) {
    console.log(`Inserting ${ordersToInsert.length} orders in bulk...`);
    // Insert in chunks of 1000 to prevent payload limit errors
    const chunkSize = 1000;
    for (let k = 0; k < ordersToInsert.length; k += chunkSize) {
      const chunk = ordersToInsert.slice(k, k + chunkSize);
      await Order.insertMany(chunk);
    }
    console.log('Orders inserted.');
  }

  if (productUpdates.length > 0) {
    console.log('Updating product sales counts...');
    await Product.bulkWrite(productUpdates);
    console.log('Product sales counts updated.');
  }

  console.log('*** CONSISTENT ORDER SEEDING COMPLETED ***');
  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  mongoose.disconnect();
});
