const mongoose = require('mongoose');
const uri = 'mongodb://premkishor:Hsndehzd6oFmbvHA@ac-busl9fe-shard-00-00.x1ez0rp.mongodb.net:27017,ac-busl9fe-shard-00-01.x1ez0rp.mongodb.net:27017,ac-busl9fe-shard-00-02.x1ez0rp.mongodb.net:27017/?authSource=admin&replicaSet=atlas-120zxf-shard-0&ssl=true';

async function check() {
  await mongoose.connect(uri);
  console.log('Connected to DB');
  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  for (let col of collections) {
    const count = await db.collection(col.name).countDocuments();
    console.log(`${col.name}: ${count} documents`);
  }
  await mongoose.disconnect();
}
check().catch(console.error);
