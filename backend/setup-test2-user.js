const mongoose = require('mongoose');

const DB_URI = 'mongodb+srv://premkishor:Hsndehzd6oFmbvHA@cluster0.x1ez0rp.mongodb.net/test';

async function main() {
  try {
    await mongoose.connect(DB_URI);
    console.log('Connected to MongoDB.');

    // 1. Setup User
    const email = 'test2@mail.com';
    let user = await mongoose.connection.db.collection('users').findOne({ email });
    
    // Hash password
    let passwordHash = 'Password123!';
    try {
      const bcrypt = require('bcrypt');
      passwordHash = await bcrypt.hash('Password123!', 10);
    } catch (e) {
      console.log('Bcrypt not available, using plain password.');
    }

    if (!user) {
      const userInsert = await mongoose.connection.db.collection('users').insertOne({
        email,
        passwordHash,
        password: 'Password123!',
        phone: '1234567890',
        roles: ['Customer'],
        permissions: [],
        mfaEnabled: false,
        loginAttempts: 0,
        lockoutUntil: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      user = { _id: userInsert.insertedId };
      console.log(`Created user ${email} with ID: ${user._id}`);
    } else {
      console.log(`User ${email} already exists with ID: ${user._id}`);
    }

    // 2. Setup Address
    const addressCol = mongoose.connection.db.collection('addresses');
    const existingAddress = await addressCol.findOne({ userId: user._id });
    if (!existingAddress) {
      await addressCol.insertOne({
        userId: user._id,
        fullName: 'Test User Two',
        mobileNumber: '1234567890',
        country: 'India',
        state: 'Delhi',
        city: 'New Delhi',
        street: '456 Innovation Road',
        pincode: '110001',
        addressType: 'Home',
        isDefault: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('Added default shipping address for test2@mail.com.');
    } else {
      console.log('Shipping address already exists.');
    }

    // 3. Setup Payment Method
    const pmCol = mongoose.connection.db.collection('paymentmethods');
    const existingPm = await pmCol.findOne({ userId: user._id });
    if (!existingPm) {
      await pmCol.insertOne({
        userId: user._id,
        type: 'card',
        cardDetails: {
          brand: 'Visa',
          last4: '1111',
          expiryMonth: 12,
          expiryYear: 2030,
          token: 'tok_visa'
        },
        upiDetails: null,
        walletDetails: null,
        isDefault: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('Added default payment method (Visa card) for test2@mail.com.');
    } else {
      console.log('Payment method already exists.');
    }

  } catch (error) {
    console.error('Setup failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

main();
