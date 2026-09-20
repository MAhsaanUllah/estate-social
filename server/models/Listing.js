const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  purpose: {
    type: String,
    required: [true, 'Purpose is required'],
    enum: ['Sale', 'Rent'],
  },
  propertyType: {
    type: String,
    required: [true, 'Property type is required'],
    enum: ['House', 'Plot', 'Commercial', 'Flat', 'Apartment', 'Farmhouse', 'Penthouse'],
  },
  society: {
    type: String,
    required: [true, 'Society name is required'],
    trim: true,
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
    index: true,
  },
  possessionStatus: {
    type: String,
    enum: ['Ready', 'UnderConstruction', 'OnApplication'],
    default: 'Ready',
  },
  phase: {
    type: String,
    trim: true,
  },
  block: {
    type: String,
    trim: true,
  },
  landmark: {
    type: String,
    trim: true,
  },
  mapUrl: {
    type: String,
    trim: true,
  },
  size: {
    type: Number,
    required: [true, 'Size is required'],
    min: [0.1, 'Size must be at least 0.1'],
  },
  sizeUnit: {
    type: String,
    required: [true, 'Size unit is required'],
    enum: ['Marla', 'Kanal', 'SqFt', 'SqYd'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  isInstallmentAvailable: {
    type: Boolean,
    default: false,
  },
  installmentDetails: {
    downPayment: Number,
    monthlyInstallment: Number,
    durationMonths: Number,
  },
  images: [{
    type: String,
    trim: true,
  }],
  features: [{
    type: String,
    trim: true,
  }],
  beds: {
    type: Number,
    min: 0,
    max: 50,
  },
  baths: {
    type: Number,
    min: 0,
    max: 50,
  },
  kitchens: {
    type: Number,
    min: 0,
    max: 20,
  },
  // Commercial Specific
  rentalIncome: {
    type: Number,
    min: 0,
  },
  totalFloors: {
    type: String,
    trim: true,
  },
  roadWidth: {
    type: String,
    trim: true,
  },
  parkingCapacity: {
    type: String,
    trim: true,
  },
  powerBackup: {
    type: String,
    trim: true,
  },
  // Plot Specific
  plotType: {
    type: String,
    trim: true,
    default: 'Standard',
  },
  dimensions: {
    type: String,
    trim: true,
  },
  // Apartment / Flat Specific
  floorLevel: {
    type: String,
    trim: true,
  },
  viewType: {
    type: String,
    trim: true,
  },
  carParking: {
    type: String,
    trim: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  listedBy: {
    type: String,
    enum: ['agent', 'owner'],
    default: 'owner',
  },
  status: {
    type: String,
    enum: ['Active', 'Sold', 'UnderOffer', 'Draft', 'Pending', 'Rejected'],
    default: 'Active',
  },
  views: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      default: [0, 0],
    },
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

listingSchema.index({ status: 1, city: 1, propertyType: 1, purpose: 1 });
listingSchema.index({ creator: 1, status: 1 });
listingSchema.index({ isFeatured: 1, status: 1, createdAt: -1 });
listingSchema.index({ society: 1, phase: 1, block: 1 });
listingSchema.index({ price: 1 });
listingSchema.index({ createdAt: -1 });
listingSchema.index({ 'location.coordinates': '2dsphere' });

listingSchema.virtual('inquiries', {
  ref: 'Inquiry',
  localField: '_id',
  foreignField: 'listing',
});

module.exports = mongoose.model('Listing', listingSchema);