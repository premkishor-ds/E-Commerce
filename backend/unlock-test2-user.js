const mongoose = require('mongoose');

const DB_URI = 'mongodb+srv://premkishor:Hsndehzd6oFmbvHA@cluster0.x1ez0rp.mongodb.net/test';

async function main() {
  try {
    await mongoose.connect(DB_URI);
    console.log('Connected to MongoDB.');
    const result = await mongoose.connection.db.collection('users').updateOne(
      { email: 'test2@mail.com' },
      { $set: { lockoutUntil: null, loginAttempts: 0 } }
    );
    if (result.matchedCount > 0) {
      console.log('Successfully unlocked test2@mail.com account.');
    } else {
      console.log('User test2@mail.com not found.');
    }
  } catch (error) {
    console.error('Error unlocking account:', error);
  } finally {
    await mongoose.disconnect();
  }
}

main();
