const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://premkishor:Hsndehzd6oFmbvHA@ac-busl9fe-shard-00-00.x1ez0rp.mongodb.net:27017,ac-busl9fe-shard-00-01.x1ez0rp.mongodb.net:27017,ac-busl9fe-shard-00-02.x1ez0rp.mongodb.net:27017/?authSource=admin&replicaSet=atlas-120zxf-shard-0&ssl=true';

const OrderSchema = new mongoose.Schema({
  items: [{
    productId: mongoose.Schema.Types.ObjectId,
    quantity: Number
  }],
  status: String
}, { collection: 'orders' });

const Order = mongoose.model('Order', OrderSchema);

async function main() {
  await mongoose.connect(MONGODB_URI);
  
  // Count items sold per product
  const orders = await Order.find({ status: { $in: ['Paid', 'Shipped', 'Delivered'] } });
  const counts = {};
  
  orders.forEach(order => {
    order.items.forEach(item => {
      const pId = item.productId.toString();
      counts[pId] = (counts[pId] || 0) + item.quantity;
    });
  });

  const sampleProductIds = Object.keys(counts).slice(0, 5);
  console.log('Actual sales counts (based on orders in DB) for first 5 products:');
  sampleProductIds.forEach(id => {
    console.log(`Product ID ${id}: ${counts[id]} units sold`);
  });

  await mongoose.disconnect();
}

main().catch(console.error);
