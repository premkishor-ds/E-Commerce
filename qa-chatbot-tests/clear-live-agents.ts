import { MongoClient } from 'mongodb';

const DB_URI = 'mongodb+srv://premkishor:Hsndehzd6oFmbvHA@cluster0.x1ez0rp.mongodb.net/test';

async function main() {
  const client = new MongoClient(DB_URI);
  try {
    await client.connect();
    const db = client.db();
    const result = await db.collection('livechatsessions').updateMany(
      { status: 'Active' },
      { $set: { status: 'Closed' } }
    );
    console.log(`Successfully closed ${result.modifiedCount} active live agent chat sessions.`);
  } catch (error) {
    console.error('Error closing sessions:', error);
  } finally {
    await client.close();
  }
}

main();
