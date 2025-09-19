const mongoose = require('mongoose');
require('dotenv').config({ path: './frontend/.env' });
const Contact = require('../backend/models/Contact');

async function main() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/devstudio';
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    const docs = await Contact.find().sort({ createdAt: -1 }).limit(20).lean();
    console.log('Recent contacts:', docs.length);
    docs.forEach(d => {
      console.log(d._id, d.name, d.email, d.status, d.createdAt);
    });
  } catch (err) {
    console.error('Error querying contacts:', err);
  } finally {
    await mongoose.disconnect();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
