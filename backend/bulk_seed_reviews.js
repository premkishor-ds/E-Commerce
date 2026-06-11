const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const MONGODB_URI = 'mongodb://premkishor:Hsndehzd6oFmbvHA@ac-busl9fe-shard-00-00.x1ez0rp.mongodb.net:27017,ac-busl9fe-shard-00-01.x1ez0rp.mongodb.net:27017,ac-busl9fe-shard-00-02.x1ez0rp.mongodb.net:27017/?authSource=admin&replicaSet=atlas-120zxf-shard-0&ssl=true';

// Define mini Schemas inline
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
  description: String,
  price: Number,
  category: mongoose.Schema.Types.ObjectId,
  averageRating: Number
}, { collection: 'products' });

const OrderSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  items: Array,
  status: String,
  totalPrice: Number,
  shippingAddress: Object
}, { collection: 'orders', timestamps: true });

const ReviewSchema = new mongoose.Schema({
  productId: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId,
  rating: Number,
  comment: String,
  verifiedPurchase: Boolean,
  status: String,
  likesCount: Number,
  likedBy: Array
}, { collection: 'reviews', timestamps: true });

const CategorySchema = new mongoose.Schema({
  name: String
}, { collection: 'categories' });

const User = mongoose.model('User', UserSchema);
const Product = mongoose.model('Product', ProductSchema);
const Order = mongoose.model('Order', OrderSchema);
const Review = mongoose.model('Review', ReviewSchema);
const Category = mongoose.model('Category', CategorySchema);

const reviewsByCategory = {
  'Electronics': [
    'Exceptional build quality and audio clarity. Highly recommend this brand!',
    'Extremely fast response time, perfect display resolution, and zero lag. Love it.',
    'Good value for money. Battery life is solid, charging is speedy.',
    'Super premium feel, active noise cancelling works perfectly.',
    'A bit expensive but absolutely worth the price for the specs.',
    'Sleek design, fits perfectly and is very lightweight.',
    'The display is incredibly bright and colorful. Highly recommended!',
    'Exceeded my expectations. Build quality is solid and functions flawlessly.'
  ],
  'Home & Kitchen': [
    'Revolutionized my cooking routine! The presets are accurate and pot is easy to clean.',
    'Spacious capacity, works exactly as described. Sleek stainless steel design.',
    'Fantastic smart multi-cooker. High quality non-stick surface.',
    'Easy to use, saves a lot of time. Design is modern and compact.',
    'Works great, although instructions could be a bit clearer.',
    'Highly durable material. Cleans up in seconds. Very happy with this.'
  ],
  'Fashion & Apparel': [
    'Outstanding stretch and comfort. Material is thick and fits true to size.',
    'Very soft fabric, color looks even better in person. Will buy again.',
    'Perfect active wear. Highly breathable, highly recommend.',
    'Fits like a glove. The stitch work is top notch.',
    'Comfortable for all day wear. Matches the descriptions exactly.'
  ],
  'Fitness & Sports': [
    'Incredibly lightweight carbon frame. Shifts gears seamlessly.',
    'Outstanding performance, built with premium materials. Fast shipping.',
    'Solid and durable design, perfect for daily training workouts.',
    'Exactly what I needed for my training routine. High durability.',
    'Super fast delivery, quality is superb and handles well.'
  ]
};

async function main() {
  console.log('Connecting to database...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB Atlas.');

  // Fetch Categories to map product reviews accurately
  const categories = await Category.find({});
  const categoryMap = {};
  categories.forEach(c => {
    categoryMap[c._id.toString()] = c.name;
  });

  // 1. Create 100 customer users if they don't exist
  console.log('Ensuring 100 customer users exist...');
  const count = await User.countDocuments({ email: /customer\.seed\./ });
  let customerUsers = [];
  
  if (count < 100) {
    console.log(`Only found ${count} seed customers. Generating 100 new seed customers...`);
    const passwordHash = await bcrypt.hash('Password123!', 10);
    const usersToInsert = [];
    
    for (let i = 1; i <= 100; i++) {
      usersToInsert.push({
        email: `customer.seed.${i}@example.com`,
        passwordHash,
        roles: ['Customer'],
        displayName: `Customer Seed ${i}`,
        phone: `+15550100${String(i).padStart(3, '0')}`,
        accountStatus: 'Active'
      });
    }
    
    // Clear out existing seed customers to start fresh
    await User.deleteMany({ email: /customer\.seed\./ });
    customerUsers = await User.insertMany(usersToInsert);
    console.log(`Inserted 100 fresh seed customers.`);
  } else {
    customerUsers = await User.find({ email: /customer\.seed\./ });
    console.log(`Found existing ${customerUsers.length} seed customers.`);
  }

  // 2. Fetch all products
  const products = await Product.find({});
  console.log(`Found ${products.length} products to review.`);

  // Clear existing reviews & orders of seed users to start clean
  const customerUserIds = customerUsers.map(u => u._id);
  console.log('Clearing old seed reviews and orders...');
  await Review.deleteMany({ userId: { $in: customerUserIds } });
  await Order.deleteMany({ userId: { $in: customerUserIds } });

  const reviewsToInsert = [];
  const ordersToInsert = [];
  const productUpdates = [];

  console.log('Generating reviews and orders for each product (5 to 15 per product)...');
  
  for (let pIdx = 0; pIdx < products.length; pIdx++) {
    const product = products[pIdx];
    const catName = categoryMap[product.category?.toString()] || 'Electronics';
    
    const numReviews = Math.floor(Math.random() * 11) + 5; // 5 to 15 inclusive
    
    // Shuffle customer users to get random ones for this product
    const shuffledUsers = [...customerUsers].sort(() => 0.5 - Math.random());
    
    let ratingsSum = 0;
    
    for (let r = 0; r < numReviews; r++) {
      const user = shuffledUsers[r];
      
      // Select comment template
      const comments = reviewsByCategory[catName] || reviewsByCategory['Electronics'];
      const comment = comments[Math.floor(Math.random() * comments.length)];
      
      // Random rating (3 to 5 stars, heavily weighted to 4 and 5)
      const ratingOptions = [3, 4, 4, 5, 5, 5, 5];
      const rating = ratingOptions[Math.floor(Math.random() * ratingOptions.length)];
      ratingsSum += rating;

      // Create Order
      ordersToInsert.push({
        userId: user._id,
        items: [{
          productId: product._id,
          quantity: 1,
          price: product.price
        }],
        status: 'Paid',
        totalPrice: product.price,
        shippingAddress: {
          fullName: user.displayName,
          addressLine1: '123 E-Commerce Way',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400001',
          country: 'India',
          phone: user.phone
        }
      });

      // Create Review
      reviewsToInsert.push({
        productId: product._id,
        userId: user._id,
        rating,
        comment,
        verifiedPurchase: true,
        status: 'Approved',
        likesCount: Math.floor(Math.random() * 8),
        likedBy: []
      });
    }

    const averageRating = parseFloat((ratingsSum / numReviews).toFixed(1));
    productUpdates.push({
      updateOne: {
        filter: { _id: product._id },
        update: { $set: { averageRating } }
      }
    });
  }

  // 3. Bulk Write
  console.log(`Inserting ${ordersToInsert.length} orders in bulk...`);
  await Order.insertMany(ordersToInsert);
  console.log('Orders inserted.');

  console.log(`Inserting ${reviewsToInsert.length} reviews in bulk...`);
  await Review.insertMany(reviewsToInsert);
  console.log('Reviews inserted.');

  console.log(`Updating averageRating for all ${products.length} products...`);
  await Product.bulkWrite(productUpdates);
  console.log('Product average ratings updated.');

  console.log('*** BULK SEEDING COMPLETED SUCCESSFULLY ***');
  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  mongoose.disconnect();
});
