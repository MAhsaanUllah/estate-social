const mongoose = require('mongoose');

const valuationSchema = new mongoose.Schema({
  // Property details
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
  },
  society: {
    type: String,
    required: [true, 'Society is required'],
    trim: true,
  },
  propertyType: {
    type: String,
    required: [true, 'Property type is required'],
    enum: ['House', 'Plot', 'Commercial'],
  },
  size: {
    type: Number,
    required: [true, 'Size is required'],
    min: [1, 'Size must be at least 1'],
  },
  sizeUnit: {
    type: String,
    required: [true, 'Size unit is required'],
    enum: ['Marla', 'Kanal', 'SqFt'],
  },
  purpose: {
    type: String,
    enum: ['Sale', 'Rent'],
    default: 'Sale',
  },
  // Estimate result
  estimateLow: { type: Number },
  estimateHigh: { type: Number },
  estimateMid: { type: Number },
  // Lead contact (agents follow up — mini-CRM value)
  name: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Closed'],
    default: 'New',
  },
}, {
  timestamps: true,
});

valuationSchema.index({ city: 1, society: 1, createdAt: -1 });

module.exports = mongoose.model('Valuation', valuationSchema);