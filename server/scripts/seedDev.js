require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const seedDefaults = require('../config/seedDefaults');

async function run() {
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ ERROR: seed:dev cannot be executed in production environment.');
    process.exit(1);
  }

  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/estate-marketplace';
  console.log('🌱 Connecting to database for development fixture seeding...');
  await mongoose.connect(mongoUri);
  await seedDefaults(true); // Force seed
  console.log('✅ Development seed complete.');
  process.exit(0);
}

run().catch(err => {
  console.error('❌ Seeding error:', err);
  process.exit(1);
});
