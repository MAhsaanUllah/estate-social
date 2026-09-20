const mongoose = require('mongoose');

const connectDB = async () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isTest = process.env.NODE_ENV === 'test';
  const allowMemoryDB = process.env.ALLOW_MEMORY_DB === 'true';
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/estate-marketplace';

  try {
    const conn = await mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 4000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    // In production: NEVER fall back to in-memory DB. Fail startup safely.
    if (isProduction) {
      console.error(`❌ CRITICAL: MongoDB connection failed in production mode (${error.message}).`);
      console.error(`🚨 Halting server startup. In-memory fallback is strictly disabled in production.`);
      process.exit(1);
    }

    // In development or test: Only allow in-memory DB if explicitly permitted or in test environment
    if (isTest || allowMemoryDB) {
      console.warn(`⚠️ Real MongoDB connection failed (${error.message}). Starting isolated in-memory test database...`);
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const memUri = mongod.getUri();
        const conn = await mongoose.connect(memUri);
        console.log(`✅ In-Memory Test Database Connected: ${conn.connection.host}`);
        return conn;
      } catch (memError) {
        console.error(`❌ Failed to start in-memory database: ${memError.message}`);
        process.exit(1);
      }
    } else {
      console.error(`❌ MongoDB connection failed: ${error.message}`);
      console.error(`💡 Tip: Ensure MongoDB is running locally on port 27017, or set ALLOW_MEMORY_DB=true for local development.`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;