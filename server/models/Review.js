const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Agent is required'],
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Reviewer is required'],
  },
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
  },
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    maxlength: [1000, 'Comment cannot exceed 1000 characters'],
  },
  isVerifiedClient: {
    type: Boolean,
    default: false,
  },
  response: {
    type: String,
    maxlength: [500, 'Response cannot exceed 500 characters'],
  },
  respondedAt: {
    type: Date,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

reviewSchema.index({ agent: 1, reviewer: 1 }, { unique: true });
reviewSchema.index({ agent: 1, createdAt: -1 });
reviewSchema.index({ reviewer: 1 });

reviewSchema.virtual('agentDetails', {
  ref: 'User',
  localField: 'agent',
  foreignField: '_id',
  justOne: true,
});

reviewSchema.virtual('reviewerDetails', {
  ref: 'User',
  localField: 'reviewer',
  foreignField: '_id',
  justOne: true,
});

reviewSchema.virtual('listingDetails', {
  ref: 'Listing',
  localField: 'listing',
  foreignField: '_id',
  justOne: true,
});

module.exports = mongoose.model('Review', reviewSchema);