const mongoose = require('mongoose');

const DB_URI = 'mongodb+srv://premkishor:Hsndehzd6oFmbvHA@cluster0.x1ez0rp.mongodb.net/test';

async function main() {
  try {
    await mongoose.connect(DB_URI);
    console.log('Connected to MongoDB.');

    // Find user
    const email = 'test2@mail.com';
    let user = await mongoose.connection.db.collection('users').findOne({ email });
    if (!user) {
      console.error('User not found. Run main setup first.');
      return;
    }

    // 1. Add second address (Office)
    const addressCol = mongoose.connection.db.collection('addresses');
    const hasOffice = await addressCol.findOne({ userId: user._id, addressType: 'Office' });
    if (!hasOffice) {
      await addressCol.insertOne({
        userId: user._id,
        fullName: 'Test User Two (Office)',
        mobileNumber: '9876543210',
        country: 'India',
        state: 'Karnataka',
        city: 'Bangalore',
        street: '789 Tech Park, Phase 2',
        pincode: '560001',
        addressType: 'Office',
        isDefault: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('Added secondary (Office) address for test2@mail.com.');
    } else {
      console.log('Office address already exists.');
    }

    // 2. Add second payment method (Mastercard)
    const pmCol = mongoose.connection.db.collection('paymentmethods');
    const existingMastercard = await pmCol.findOne({ userId: user._id, 'cardDetails.brand': 'Mastercard' });
    if (!existingMastercard) {
      await pmCol.insertOne({
        userId: user._id,
        type: 'card',
        cardDetails: {
          brand: 'Mastercard',
          last4: '2222',
          expiryMonth: 6,
          expiryYear: 2029,
          token: 'tok_mastercard'
        },
        upiDetails: null,
        walletDetails: null,
        isDefault: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('Added secondary payment method (Mastercard) for test2@mail.com.');
    } else {
      console.log('Mastercard payment method already exists.');
    }

    // 3. Add third payment method (UPI)
    const existingUpi = await pmCol.findOne({ userId: user._id, type: 'upi' });
    if (!existingUpi) {
      await pmCol.insertOne({
        userId: user._id,
        type: 'upi',
        cardDetails: null,
        upiDetails: {
          vpa: 'test2@upi'
        },
        walletDetails: null,
        isDefault: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('Added secondary payment method (UPI: test2@upi) for test2@mail.com.');
    } else {
      console.log('UPI payment method already exists.');
    }

  } catch (error) {
    console.error('Setup failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

main();
