const mongoose = require('mongoose');

const DB_URI = 'mongodb+srv://premkishor:Hsndehzd6oFmbvHA@cluster0.x1ez0rp.mongodb.net/test';

async function main() {
  try {
    await mongoose.connect(DB_URI);
    console.log('Connected to MongoDB.');
    const result = await mongoose.connection.db.collection('livechatsessions').updateMany(
      { status: 'Active' },
      { $set: { status: 'Closed' } }
    );
    console.log(`Successfully closed ${result.modifiedCount} active live agent chat sessions.`);
  } catch (error) {
    console.error('Error closing sessions:', error);
  } finally {
    await mongoose.disconnect();
  }
}

main();
