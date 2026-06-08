const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const MONGODB_URI = "mongodb://premkishor:Hsndehzd6oFmbvHA@ac-busl9fe-shard-00-00.x1ez0rp.mongodb.net:27017,ac-busl9fe-shard-00-01.x1ez0rp.mongodb.net:27017,ac-busl9fe-shard-00-02.x1ez0rp.mongodb.net:27017/?authSource=admin&replicaSet=atlas-120zxf-shard-0&ssl=true";

const UserSchema = new mongoose.Schema({
  email: String,
  passwordHash: String,
  phone: String,
  roles: [String],
  permissions: [String],
}, { timestamps: true, collection: 'users' });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to DB');

  const pwHash = await bcrypt.hash('password123', 10);

  // 1. Setup Seller
  let seller = await User.findOne({ email: 'seller@example.com' });
  if (seller) {
    seller.roles = ['Seller'];
    seller.passwordHash = pwHash;
    await seller.save();
    console.log('Updated seller@example.com with Seller role');
  } else {
    seller = await User.create({
      email: 'seller@example.com',
      passwordHash: pwHash,
      roles: ['Seller'],
      phone: '+12025550189',
      permissions: []
    });
    console.log('Created seller@example.com with Seller role');
  }

  // 2. Setup Vendor
  let vendor = await User.findOne({ email: 'vendor@example.com' });
  if (vendor) {
    vendor.roles = ['Vendor'];
    vendor.passwordHash = pwHash;
    await vendor.save();
    console.log('Updated vendor@example.com with Vendor role');
  } else {
    vendor = await User.create({
      email: 'vendor@example.com',
      passwordHash: pwHash,
      roles: ['Vendor'],
      phone: '+12025550156',
      permissions: []
    });
    console.log('Created vendor@example.com with Vendor role');
  }

  // Also make sure some products are assigned to this seller/vendor!
  // Find products where brand is 'ApexTech' and assign them to the seller's user ID!
  // Find products where brand is 'NexaHome' or 'VeloSport' and assign them to the vendor's user ID!
  const ProductSchema = new mongoose.Schema({
    title: String,
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
    vendorId: mongoose.Schema.Types.ObjectId
  }, { collection: 'products' });

  const BrandSchema = new mongoose.Schema({
    name: String
  }, { collection: 'brands' });

  const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
  const Brand = mongoose.models.Brand || mongoose.model('Brand', BrandSchema);

  const apexBrand = await Brand.findOne({ name: 'ApexTech' });
  if (apexBrand) {
    const res = await Product.updateMany({ brand: apexBrand._id }, { vendorId: seller._id });
    console.log(`Assigned ${res.modifiedCount} ApexTech products to Seller (ID: ${seller._id})`);
  }

  const nexaBrand = await Brand.findOne({ name: 'NexaHome' });
  const veloBrand = await Brand.findOne({ name: 'VeloSport' });
  const vendorBrandIds = [nexaBrand, veloBrand].filter(Boolean).map(b => b._id);
  
  if (vendorBrandIds.length > 0) {
    const res = await Product.updateMany({ brand: { $in: vendorBrandIds } }, { vendorId: vendor._id });
    console.log(`Assigned ${res.modifiedCount} NexaHome/VeloSport products to Vendor (ID: ${vendor._id})`);
  }

  await mongoose.disconnect();
}

run().catch(console.error);
