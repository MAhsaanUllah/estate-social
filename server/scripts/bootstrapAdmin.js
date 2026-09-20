require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function bootstrapAdmin() {
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL;
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;
  const name = process.env.BOOTSTRAP_ADMIN_NAME || 'Platform Administrator';

  if (!email || !password) {
    console.error('❌ Usage: Set BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD in environment variables.');
    console.error('Example: BOOTSTRAP_ADMIN_EMAIL=admin@yourdomain.com BOOTSTRAP_ADMIN_PASSWORD=SecurePass! node scripts/bootstrapAdmin.js');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('❌ Error: Password must be at least 8 characters long for production security.');
    process.exit(1);
  }

  const weakPasswords = ['password123', 'admin123', 'admin12345', 'changeme', 'estatesocial123'];
  if (weakPasswords.includes(password.toLowerCase())) {
    console.error('❌ Error: Insecure / predictable password provided. Please provide a strong unique password.');
    process.exit(1);
  }

  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/estate-marketplace';
  await mongoose.connect(mongoUri);

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.log(`ℹ️ Admin account already exists for ${email}. Updating role to admin.`);
    existing.role = 'admin';
    existing.verified = true;
    existing.kycStatus = 'Approved';
    await existing.save();
    console.log('✅ User updated to admin successfully.');
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const admin = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role: 'admin',
    username: 'admin',
    slug: 'admin',
    verified: true,
    kycStatus: 'Approved',
  });

  console.log(`✅ Production Admin account initialized successfully for: ${admin.email}`);
  process.exit(0);
}

bootstrapAdmin().catch(err => {
  console.error('❌ Admin bootstrap failed:', err);
  process.exit(1);
});
