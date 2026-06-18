const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://premkishor:Hsndehzd6oFmbvHA@ac-busl9fe-shard-00-00.x1ez0rp.mongodb.net:27017,ac-busl9fe-shard-00-01.x1ez0rp.mongodb.net:27017,ac-busl9fe-shard-00-02.x1ez0rp.mongodb.net:27017/?authSource=admin&replicaSet=atlas-120zxf-shard-0&ssl=true';

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to DB.');
  
  const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }), 'users');
  const Vendor = mongoose.model('Vendor', new mongoose.Schema({}, { strict: false }), 'vendors');
  const Seller = mongoose.model('Seller', new mongoose.Schema({}, { strict: false }), 'sellers');

  const users = await User.find({ email: /example\.com/ });
  console.log('--- USERS ---');
  for (const u of users) {
    console.log(`Email: ${u.email}, Roles: ${JSON.stringify(u.roles)}, ID: ${u._id}`);
  }

  const vendors = await Vendor.find({});
  console.log('--- VENDORS ---');
  for (const v of vendors) {
    console.log(`UserId: ${v.userId}, ShopName: ${v.shopName}, Status: ${v.status}, ID: ${v._id}`);
  }

  const sellers = await Seller.find({});
  console.log('--- SELLERS IN DB ---');
  for (const s of sellers) {
    console.log(`UserId: ${s.userId}, StoreName: ${s.storeName}, Status: ${s.status}, ID: ${s._id}`);
  }

  await mongoose.disconnect();
}

run().catch(console.error);
