const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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

const SellerSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  storeName: String,
  storeDescription: String,
  status: String,
  isActive: Boolean,
  businessEmail: String,
  businessPhone: String
}, { collection: 'sellers' });

const VendorSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  shopName: String,
  status: String,
  companyLegalName: String,
  businessPhone: String
}, { collection: 'vendors' });

const AddressSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  fullName: String,
  mobileNumber: String,
  country: String,
  state: String,
  city: String,
  street: String,
  pincode: String,
  addressType: String,
  isDefault: Boolean
}, { collection: 'addresses' });

const ProductSchema = new mongoose.Schema({
  vendorId: mongoose.Schema.Types.ObjectId
}, { collection: 'products' });

const User = mongoose.model('User', UserSchema);
const Seller = mongoose.model('Seller', SellerSchema);
const Vendor = mongoose.model('Vendor', VendorSchema);
const Address = mongoose.model('Address', AddressSchema);
const Product = mongoose.model('Product', ProductSchema);

const merchantData = [
  {
    email: 'merchant.seller1@example.com',
    storeName: 'Rajasthan Tech Hub',
    role: 'Seller',
    address: {
      fullName: 'Rajasthan Tech Hub Office',
      mobileNumber: '9876543210',
      country: 'India',
      state: 'Rajasthan',
      city: 'Bhant',
      street: '1 Tech Boulevard',
      pincode: '308708',
      addressType: 'Office',
      isDefault: true
    }
  },
  {
    email: 'merchant.seller2@example.com',
    storeName: 'Mumbai Retailers',
    role: 'Seller',
    address: {
      fullName: 'Mumbai Retailers Office',
      mobileNumber: '9876543211',
      country: 'India',
      state: 'Maharashtra',
      city: 'Mumbai',
      street: '45 Nariman Point',
      pincode: '400001',
      addressType: 'Office',
      isDefault: true
    }
  },
  {
    email: 'merchant.seller3@example.com',
    storeName: 'Delhi Electronics',
    role: 'Seller',
    address: {
      fullName: 'Delhi Electronics Head Office',
      mobileNumber: '9876543212',
      country: 'India',
      state: 'Delhi',
      city: 'New Delhi',
      street: '12 Connaught Place',
      pincode: '110001',
      addressType: 'Office',
      isDefault: true
    }
  },
  {
    email: 'merchant.vendor1@example.com',
    storeName: 'Bangalore Chipsets',
    role: 'Vendor',
    address: {
      fullName: 'Bangalore Chipsets Warehouse',
      mobileNumber: '9876543213',
      country: 'India',
      state: 'Karnataka',
      city: 'Bengaluru',
      street: '100 Outer Ring Road',
      pincode: '560001',
      addressType: 'Office',
      isDefault: true
    }
  },
  {
    email: 'merchant.vendor2@example.com',
    storeName: 'Chennai Logistics',
    role: 'Vendor',
    address: {
      fullName: 'Chennai Logistics Warehouse',
      mobileNumber: '9876543214',
      country: 'India',
      state: 'Tamil Nadu',
      city: 'Chennai',
      street: '22 Mount Road',
      pincode: '600001',
      addressType: 'Office',
      isDefault: true
    }
  },
  {
    email: 'merchant.vendor3@example.com',
    storeName: 'Kolkata Wholesale',
    role: 'Vendor',
    address: {
      fullName: 'Kolkata Wholesale Depot',
      mobileNumber: '9876543215',
      country: 'India',
      state: 'West Bengal',
      city: 'Kolkata',
      street: '88 Salt Lake Sector V',
      pincode: '700001',
      addressType: 'Office',
      isDefault: true
    }
  }
];

async function main() {
  console.log('Connecting to database...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB Atlas.');

  // Clean old merchant seeds to avoid duplication
  const emails = merchantData.map(m => m.email);
  console.log('Cleaning old merchant records...');
  const existingUsers = await User.find({ email: { $in: emails } });
  const userIds = existingUsers.map(u => u._id);
  
  await Address.deleteMany({ userId: { $in: userIds } });
  await Seller.deleteMany({ userId: { $in: userIds } });
  await Vendor.deleteMany({ userId: { $in: userIds } });
  await User.deleteMany({ email: { $in: emails } });

  const passwordHash = await bcrypt.hash('password123', 10);
  const createdMerchants = [];

  for (const m of merchantData) {
    console.log(`Creating user for merchant: ${m.email}`);
    const user = await User.create({
      email: m.email,
      passwordHash,
      roles: [m.role],
      displayName: m.storeName,
      phone: m.address.mobileNumber,
      accountStatus: 'Active'
    });

    console.log(`Creating ${m.role} profile...`);
    if (m.role === 'Seller') {
      await Seller.create({
        userId: user._id,
        storeName: m.storeName,
        storeDescription: `Premium ${m.storeName} storefront.`,
        status: 'Active',
        isActive: true,
        businessEmail: m.email,
        businessPhone: m.address.mobileNumber
      });
    } else {
      await Vendor.create({
        userId: user._id,
        shopName: m.storeName,
        status: 'Active',
        companyLegalName: `${m.storeName} Ltd.`,
        businessPhone: m.address.mobileNumber
      });
    }

    console.log(`Creating Office address for ${m.storeName} in ${m.address.city}, ${m.address.state}...`);
    await Address.create({
      userId: user._id,
      ...m.address
    });

    createdMerchants.push(user._id);
  }

  // Assign every product in the database to one of the merchants randomly
  console.log('Fetching products to link...');
  const products = await Product.find({});
  console.log(`Linking ${products.length} products to seeded merchants...`);

  const productUpdates = [];
  for (let i = 0; i < products.length; i++) {
    const merchantId = createdMerchants[i % createdMerchants.length];
    productUpdates.push({
      updateOne: {
        filter: { _id: products[i]._id },
        update: { $set: { vendorId: merchantId } }
      }
    });
  }

  if (productUpdates.length > 0) {
    await Product.bulkWrite(productUpdates);
  }

  console.log('*** SEEDING MERCHANTS AND LINKING PRODUCTS COMPLETED ***');
  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  mongoose.disconnect();
});
