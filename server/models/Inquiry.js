const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: [true, 'Listing is required'],
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Buyer is required'],
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Seller is required'],
  },
  buyerName: {
    type: String,
    required: [true, 'Buyer name is required'],
    trim: true,
  },
  buyerPhone: {
    type: String,
    required: [true, 'Buyer phone is required'],
    trim: true,
  },
  buyerEmail: {
    type: String,
    trim: true,
    lowercase: true,
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: [1000, 'Message cannot exceed 1000 characters'],
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Site Visit', 'Closed'],
    default: 'New',
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters'],
  },
  contactDate: {
    type: Date,
  },
  visitDate: {
    type: Date,
  },
  closedDate: {
    type: Date,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

inquirySchema.index({ listing: 1, buyer: 1 }, { unique: true });
inquirySchema.index({ seller: 1, status: 1 });
inquirySchema.index({ buyer: 1, createdAt: -1 });
inquirySchema.index({ createdAt: -1 });

inquirySchema.virtual('listingDetails', {
  ref: 'Listing',
  localField: 'listing',
  foreignField: '_id',
  justOne: true,
});

inquirySchema.virtual('buyerDetails', {
  ref: 'User',
  localField: 'buyer',
  foreignField: '_id',
  justOne: true,
});

inquirySchema.virtual('sellerDetails', {
  ref: 'User',
  localField: 'seller',
  foreignField: '_id',
  justOne: true,
});

module.exports = mongoose.model('Inquiry', inquirySchema);