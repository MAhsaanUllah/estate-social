const Listing = require('../models/Listing');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const { deleteImage } = require('../config/cloudinary');

const CREATOR_POPULATE_FIELDS = 'name username slug phone agencyName avatar verified bio city address rating dealsClosed designation';

const escapeRegex = (string) => {
  return (string || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&').trim();
};

const isValidObjectId = (id) => {
  return Boolean(id && typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/));
};

// GET /api/listings — Public marketplace search & discovery
exports.getListings = asyncHandler(async (req, res) => {
  const {
    purpose,
    propertyType,
    society,
    city,
    possessionStatus,
    phase,
    block,
    listedBy,
    status,
    isFeatured,
    minPrice,
    maxPrice,
    minSize,
    maxSize,
    search,
    page = 1,
    limit = 12,
    sort = '-createdAt',
  } = req.query;

  const query = {};

  // Server-side status enforcement: Public marketplace strictly displays Active listings
  if (status && req.user && req.user.role === 'admin') {
    if (status !== 'All') query.status = status;
  } else {
    query.status = 'Active';
  }

  if (purpose && typeof purpose === 'string') {
    query.purpose = { $regex: new RegExp(`^${escapeRegex(purpose)}$`, 'i') };
  }
  if (propertyType && typeof propertyType === 'string') {
    query.propertyType = { $regex: new RegExp(`^${escapeRegex(propertyType)}$`, 'i') };
  }
  if (listedBy && typeof listedBy === 'string') {
    query.listedBy = escapeRegex(listedBy).toLowerCase();
  }
  if (isFeatured === 'true') {
    query.isFeatured = true;
  }
  if (city && typeof city === 'string') {
    query.city = { $regex: escapeRegex(city), $options: 'i' };
  }
  if (possessionStatus && typeof possessionStatus === 'string') {
    query.possessionStatus = escapeRegex(possessionStatus);
  }
  if (society && typeof society === 'string') {
    query.society = { $regex: escapeRegex(society), $options: 'i' };
  }
  if (phase && typeof phase === 'string') {
    query.phase = { $regex: escapeRegex(phase), $options: 'i' };
  }
  if (block && typeof block === 'string') {
    query.block = { $regex: escapeRegex(block), $options: 'i' };
  }
  if (req.query.isInstallment === 'true') {
    query.isInstallmentAvailable = true;
  }

  // Safe numeric range parsing
  const parsedMinPrice = parseFloat(minPrice);
  const parsedMaxPrice = parseFloat(maxPrice);
  if (Number.isFinite(parsedMinPrice) || Number.isFinite(parsedMaxPrice)) {
    query.price = {};
    if (Number.isFinite(parsedMinPrice) && parsedMinPrice >= 0) query.price.$gte = parsedMinPrice;
    if (Number.isFinite(parsedMaxPrice) && parsedMaxPrice >= 0) query.price.$lte = parsedMaxPrice;
  }

  const parsedMinSize = parseFloat(minSize);
  const parsedMaxSize = parseFloat(maxSize);
  if (Number.isFinite(parsedMinSize) || Number.isFinite(parsedMaxSize)) {
    query.size = {};
    if (Number.isFinite(parsedMinSize) && parsedMinSize >= 0) query.size.$gte = parsedMinSize;
    if (Number.isFinite(parsedMaxSize) && parsedMaxSize >= 0) query.size.$lte = parsedMaxSize;
  }

  if (search && typeof search === 'string') {
    const safeSearch = escapeRegex(search);
    query.$or = [
      { title: { $regex: safeSearch, $options: 'i' } },
      { description: { $regex: safeSearch, $options: 'i' } },
      { society: { $regex: safeSearch, $options: 'i' } },
      { city: { $regex: safeSearch, $options: 'i' } },
    ];
  }

  // Bounded Pagination
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 12));
  const skip = (pageNum - 1) * limitNum;

  // Safe sort allowlist
  const allowedSorts = ['-createdAt', 'createdAt', '-price', 'price', '-views', '-isFeatured'];
  const safeSort = allowedSorts.includes(sort) ? sort : '-createdAt';

  const [listings, total] = await Promise.all([
    Listing.find(query)
      .populate('creator', CREATOR_POPULATE_FIELDS)
      .sort(safeSort)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Listing.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    listings,
    total,
    totalPages: Math.ceil(total / limitNum),
    page: pageNum,
    limit: limitNum,
  });
});

// GET /api/listings/:id — Single Listing details
exports.getListingById = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(404).json({
      success: false,
      message: 'Listing not found',
    });
  }

  const listing = await Listing.findById(req.params.id)
    .populate('creator', CREATOR_POPULATE_FIELDS)
    .lean();

  if (!listing) {
    return res.status(404).json({
      success: false,
      message: 'Listing not found',
    });
  }

  // Increment views count non-blockingly
  Listing.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }).exec();

  res.status(200).json({
    success: true,
    listing,
  });
});

// POST /api/listings — Create new property listing
exports.createListing = asyncHandler(async (req, res) => {
  // Authoritative server-side identity
  req.body.creator = req.user.id;
  req.body.listedBy = (req.user.role === 'agent' || req.user.role === 'admin') ? 'agent' : 'owner';

  // Mass assignment protection: regular users cannot self-boost or set custom views
  if (req.user.role !== 'admin') {
    req.body.isFeatured = false;
  }
  req.body.views = 0;
  req.body.status = 'Active';

  // Handle uploaded images from Cloudinary or direct array
  if (req.files && req.files.length > 0) {
    req.body.images = req.files.map(file => file.path);
  }

  const listing = await Listing.create(req.body);
  await listing.populate('creator', CREATOR_POPULATE_FIELDS);

  res.status(201).json({
    success: true,
    listing,
  });
});

// PUT /api/listings/:id — Update listing with IDOR protection & mass assignment defense
exports.updateListing = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(404).json({
      success: false,
      message: 'Listing not found',
    });
  }

  let listing = await Listing.findById(req.params.id);

  if (!listing) {
    return res.status(404).json({
      success: false,
      message: 'Listing not found',
    });
  }

  // IDOR Authorization: Only the creator or an admin can modify
  if (listing.creator.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this listing',
    });
  }

  // Mass assignment protection: Strip immutable fields
  delete req.body.creator;
  delete req.body._id;
  delete req.body.createdAt;
  delete req.body.views;
  if (req.user.role !== 'admin') {
    delete req.body.isFeatured;
  }

  // Handle new uploaded images
  if (req.files && req.files.length > 0) {
    if (listing.images && listing.images.length > 0) {
      for (const imageUrl of listing.images) {
        const publicId = imageUrl.split('/').pop().split('.')[0];
        await deleteImage(`estate-social/listings/${publicId}`);
      }
    }
    req.body.images = req.files.map(file => file.path);
  }

  listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('creator', CREATOR_POPULATE_FIELDS);

  res.status(200).json({
    success: true,
    listing,
  });
});

// DELETE /api/listings/:id — Delete listing with IDOR protection
exports.deleteListing = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(404).json({
      success: false,
      message: 'Listing not found',
    });
  }

  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return res.status(404).json({
      success: false,
      message: 'Listing not found',
    });
  }

  // IDOR Authorization check
  if (listing.creator.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this listing',
    });
  }

  // Delete images from Cloudinary if stored there
  if (listing.images && listing.images.length > 0) {
    for (const imageUrl of listing.images) {
      const publicId = imageUrl.split('/').pop().split('.')[0];
      await deleteImage(`estate-social/listings/${publicId}`);
    }
  }

  await listing.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Listing deleted successfully',
  });
});

// GET /api/listings/my-listings — User's own portfolio
exports.getMyListings = asyncHandler(async (req, res) => {
  const listings = await Listing.find({ creator: req.user.id })
    .populate('creator', CREATOR_POPULATE_FIELDS)
    .sort('-createdAt')
    .lean();

  res.status(200).json({
    success: true,
    listings,
  });
});

// GET /api/listings/agent/:id — Public agent portfolio
exports.getAgentListings = asyncHandler(async (req, res) => {
  const param = req.params.id;

  let agentId = param;
  if (param.startsWith('@') || !isValidObjectId(param)) {
    const handle = (param.startsWith('@') ? param.substring(1) : param).toLowerCase().trim();
    const user = await User.findOne({ $or: [{ username: handle }, { slug: handle }] });
    if (!user) {
      return res.status(200).json({
        success: true,
        listings: [],
      });
    }
    agentId = user._id;
  }

  const listings = await Listing.find({ creator: agentId, status: 'Active' })
    .populate('creator', CREATOR_POPULATE_FIELDS)
    .sort('-createdAt')
    .lean();

  res.status(200).json({
    success: true,
    listings,
  });
});

// GET /api/listings/trending — Landing page featured inventory
exports.getTrending = asyncHandler(async (req, res) => {
  const limitNum = Math.min(12, Math.max(1, parseInt(req.query.limit) || 8));

  const listings = await Listing.find({ status: 'Active' })
    .populate('creator', CREATOR_POPULATE_FIELDS)
    .sort('-isFeatured -views -createdAt')
    .limit(limitNum)
    .lean();

  res.status(200).json({
    success: true,
    listings,
  });
});

// GET /api/listings/locations — Aggregated societies with listing counts
exports.getLocations = asyncHandler(async (req, res) => {
  const locations = await Listing.aggregate([
    { $match: { status: 'Active' } },
    {
      $group: {
        _id: { society: '$society', city: '$city' },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 24 },
    {
      $project: {
        _id: 0,
        society: '$_id.society',
        city: '$_id.city',
        count: 1,
      },
    },
  ]);

  res.status(200).json({
    success: true,
    locations,
  });
});