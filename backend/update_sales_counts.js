const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://premkishor:Hsndehzd6oFmbvHA@ac-busl9fe-shard-00-00.x1ez0rp.mongodb.net:27017,ac-busl9fe-shard-00-01.x1ez0rp.mongodb.net:27017,ac-busl9fe-shard-00-02.x1ez0rp.mongodb.net:27017/?authSource=admin&replicaSet=atlas-120zxf-shard-0&ssl=true';

// Mini schemas
const ProductSchema = new mongoose.Schema({
  salesCount: Number
}, { collection: 'products' });

const ReviewSchema = new mongoose.Schema({
  productId: mongoose.Schema.Types.ObjectId
}, { collection: 'reviews' });

const Product = mongoose.model('Product', ProductSchema);
const Review = mongoose.model('Review', ReviewSchema);

async function main() {
  console.log('Connecting to database...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB Atlas.');

  console.log('Counting reviews by product using aggregation...');
  const counts = await Review.aggregate([
    { $group: { _id: '$productId', count: { $sum: 1 } } }
  ]);

  const reviewMap = {};
  counts.forEach(c => {
    if (c._id) {
      reviewMap[c._id.toString()] = c.count;
    }
  });

  console.log('Fetching all products...');
  const products = await Product.find({});
  console.log(`Found ${products.length} products.`);

  const productUpdates = [];

  for (const product of products) {
    const numReviews = reviewMap[product._id.toString()] || 0;
    
    // Scale reviews count to realistic sales count (e.g. 1 review per ~500 sales)
    let salesCount = numReviews * (300 + Math.floor(Math.random() * 400));
    if (salesCount <= 0 && numReviews > 0) {
      salesCount = numReviews * 10;
    }
    
    productUpdates.push({
      updateOne: {
        filter: { _id: product._id },
        update: { $set: { salesCount } }
      }
    });
  }

  if (productUpdates.length > 0) {
    console.log('Performing bulk updates...');
    const result = await Product.bulkWrite(productUpdates);
    console.log(`Updated salesCount for ${result.modifiedCount} products.`);
  }

  console.log('*** PRODUCT SALES COUNT UPDATE COMPLETED ***');
  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  mongoose.disconnect();
});
