const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://premkishor:Hsndehzd6oFmbvHA@ac-busl9fe-shard-00-00.x1ez0rp.mongodb.net:27017,ac-busl9fe-shard-00-01.x1ez0rp.mongodb.net:27017,ac-busl9fe-shard-00-02.x1ez0rp.mongodb.net:27017/?authSource=admin&replicaSet=atlas-120zxf-shard-0&ssl=true';

async function run() {
  await mongoose.connect(MONGODB_URI);
  const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }), 'users');
  const Vendor = mongoose.model('Vendor', new mongoose.Schema({}, { strict: false }), 'vendors');
  const Seller = mongoose.model('Seller', new mongoose.Schema({}, { strict: false }), 'sellers');

  const emails = ['seller@example.com', 'vendor@example.com'];
  for (const email of emails) {
    const user = await User.findOne({ email });
    if (user) {
      console.log(`User ${email} found: ID=${user._id}`);
      const vendorRecord = await Vendor.findOne({ userId: user._id });
      if (vendorRecord) {
        console.log(`-> Vendor record found: status=${vendorRecord.status}, shopName=${vendorRecord.shopName}, ID=${vendorRecord._id}`);
      } else {
        console.log('-> No Vendor record found.');
      }
      const sellerRecord = await Seller.findOne({ userId: user._id });
      if (sellerRecord) {
        console.log(`-> Seller record found: status=${sellerRecord.status}, storeName=${sellerRecord.storeName}, ID=${sellerRecord._id}`);
      } else {
        console.log('-> No Seller record found.');
      }
    } else {
      console.log(`User ${email} NOT found.`);
    }
  }

  await mongoose.disconnect();
}

run().catch(console.error);
