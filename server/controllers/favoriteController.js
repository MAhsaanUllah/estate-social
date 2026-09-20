const Favorite = require('../models/Favorite');
const Listing = require('../models/Listing');
const asyncHandler = require('../middleware/asyncHandler');

exports.getFavorites = asyncHandler(async (req, res) => {
  let favorite = await Favorite.findOne({ user: req.user.id })
    .populate({
      path: 'listings',
      populate: { path: 'creator', select: 'name phone agencyName avatar' },
    })
    .lean();

  if (!favorite) {
    favorite = { listings: [] };
  }

  res.status(200).json({
    success: true,
    favorites: favorite.listings || [],
  });
});

exports.toggleFavorite = asyncHandler(async (req, res) => {
  const { listingId } = req.body;

  const listing = await Listing.findById(listingId);
  if (!listing) {
    return res.status(404).json({
      success: false,
      message: 'Listing not found',
    });
  }

  let favorite = await Favorite.findOne({ user: req.user.id });

  if (!favorite) {
    favorite = await Favorite.create({ user: req.user.id, listings: [listingId] });
    await favorite.populate({
      path: 'listings',
      populate: { path: 'creator', select: 'name phone agencyName avatar' },
    });
    return res.status(200).json({
      success: true,
      message: 'Added to favorites',
      favorite: favorite.listings[0],
      action: 'added',
    });
  }

  const index = favorite.listings.findIndex((id) => id.toString() === listingId);
  let action;

  if (index === -1) {
    favorite.listings.push(listingId);
    action = 'added';
  } else {
    favorite.listings.splice(index, 1);
    action = 'removed';
  }

  await favorite.save();

  await favorite.populate({
    path: 'listings',
    populate: { path: 'creator', select: 'name phone agencyName avatar' },
  });

  res.status(200).json({
    success: true,
    message: action === 'added' ? 'Added to favorites' : 'Removed from favorites',
    favorite: action === 'added' ? favorite.listings[favorite.listings.length - 1] : null,
    action,
  });
});

exports.clearFavorites = asyncHandler(async (req, res) => {
  await Favorite.findOneAndDelete({ user: req.user.id });

  res.status(200).json({
    success: true,
    message: 'Favorites cleared',
  });
});