const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
    unique: true,
  },
  listings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
  }],
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

favoriteSchema.index({ listings: 1 });

favoriteSchema.virtual('listingDetails', {
  ref: 'Listing',
  localField: 'listings',
  foreignField: '_id',
});

module.exports = mongoose.model('Favorite', favoriteSchema);