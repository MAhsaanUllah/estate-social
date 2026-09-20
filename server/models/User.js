const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-z0-9_-]+$/, 'Username can only contain alphanumeric characters, underscores and hyphens'],
  },
  slug: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  agencyName: {
    type: String,
    trim: true,
    maxlength: [100, 'Agency name cannot exceed 100 characters'],
  },
  city: {
    type: String,
    trim: true,
    index: true,
  },
  address: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    enum: ['buyer', 'agent', 'admin', 'owner'],
    default: 'buyer',
  },
  avatar: {
    type: String,
    default: '',
  },
  coverImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&h=600&fit=crop',
  },
  bio: {
    type: String,
    maxlength: [1000, 'Bio cannot exceed 1000 characters'],
  },
  designation: {
    type: String,
    trim: true,
    default: 'Licensed Real Estate Consultant',
  },
  verified: {
    type: Boolean,
    default: false,
  },
  kycStatus: {
    type: String,
    enum: ['Unverified', 'Pending', 'Approved', 'Rejected'],
    default: 'Unverified',
  },
  kycData: {
    type: {
      cnic: { type: String, trim: true },
      ntn: { type: String, trim: true },
      certificateType: { type: String, trim: true },
      allotmentInfo: { type: String, trim: true },
      documentUrl: { type: String, trim: true },
      submittedAt: { type: Date },
      reviewedAt: { type: Date },
      rejectionReason: { type: String, trim: true },
    },
    select: false,
  },
  socialLinks: {
    whatsapp: { type: String, trim: true },
    youtube: { type: String, trim: true },
    tiktok: { type: String, trim: true },
    instagram: { type: String, trim: true },
    facebook: { type: String, trim: true },
  },
  videoTours: [{
    title: { type: String, trim: true },
    youtubeUrl: { type: String, trim: true },
    embedUrl: { type: String, trim: true },
    views: { type: String, default: '10K+' },
    specs: { type: String, trim: true },
  }],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 4.8,
  },
  reviewsCount: {
    type: Number,
    default: 0,
  },
  dealsClosed: {
    type: String,
    default: '10+ Deals',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

userSchema.virtual('listings', {
  ref: 'Listing',
  localField: '_id',
  foreignField: 'creator',
});

userSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'agent',
});

// Password hashing handled in controller (register, updateProfile)
// pre-save hook removed due to mongoose compatibility issues

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);