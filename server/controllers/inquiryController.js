const Inquiry = require('../models/Inquiry');
const Listing = require('../models/Listing');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

exports.createInquiry = asyncHandler(async (req, res) => {
  const { listing: listingId, message, buyerPhone, buyerName, buyerEmail } = req.body;

  const listing = await Listing.findById(listingId).populate('creator', 'name email phone');

  if (!listing) {
    return res.status(404).json({
      success: false,
      message: 'Listing not found',
    });
  }

  if (listing.status !== 'Active') {
    return res.status(400).json({
      success: false,
      message: 'This property is no longer available',
    });
  }

  if (listing.creator._id.toString() === req.user.id) {
    return res.status(400).json({
      success: false,
      message: 'Cannot inquire on your own listing',
    });
  }

  const existingInquiry = await Inquiry.findOne({ listing: listingId, buyer: req.user.id });
  if (existingInquiry) {
    return res.status(400).json({
      success: false,
      message: 'You have already inquired about this property',
    });
  }

  const inquiry = await Inquiry.create({
    listing: listingId,
    buyer: req.user.id,
    seller: listing.creator._id,
    buyerName: buyerName || req.user.name,
    buyerPhone: buyerPhone || req.user.phone,
    buyerEmail: buyerEmail || req.user.email,
    message,
  });

  await inquiry.populate([
    { path: 'listing', select: 'title images price society' },
    { path: 'buyer', select: 'name phone email' },
    { path: 'seller', select: 'name phone email' },
  ]);

  res.status(201).json({
    success: true,
    inquiry,
  });
});

exports.getReceivedInquiries = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;

  const query = { seller: req.user.id };
  if (status) query.status = status;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const [inquiries, total] = await Promise.all([
    Inquiry.find(query)
      .populate('listing', 'title images price society status')
      .populate('buyer', 'name phone email')
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Inquiry.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    inquiries,
    total,
    totalPages: Math.ceil(total / limitNum),
    page: pageNum,
  });
});

exports.getSentInquiries = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const [inquiries, total] = await Promise.all([
    Inquiry.find({ buyer: req.user.id })
      .populate('listing', 'title images price society status')
      .populate('seller', 'name phone email agencyName avatar')
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Inquiry.countDocuments({ buyer: req.user.id }),
  ]);

  res.status(200).json({
    success: true,
    inquiries,
    total,
    totalPages: Math.ceil(total / limitNum),
    page: pageNum,
  });
});

exports.updateInquiry = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;

  const inquiry = await Inquiry.findById(req.params.id);

  if (!inquiry) {
    return res.status(404).json({
      success: false,
      message: 'Inquiry not found',
    });
  }

  if (inquiry.seller.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this inquiry',
    });
  }

  const validStatuses = ['New', 'Contacted', 'Site Visit', 'Closed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status',
    });
  }

  inquiry.status = status;
  if (notes) inquiry.notes = notes;

  const now = new Date();
  if (status === 'Contacted' && !inquiry.contactDate) inquiry.contactDate = now;
  if (status === 'Site Visit' && !inquiry.visitDate) inquiry.visitDate = now;
  if (status === 'Closed' && !inquiry.closedDate) inquiry.closedDate = now;

  await inquiry.save();

  await inquiry.populate([
    { path: 'listing', select: 'title images price society' },
    { path: 'buyer', select: 'name phone email' },
    { path: 'seller', select: 'name phone email' },
  ]);

  res.status(200).json({
    success: true,
    inquiry,
  });
});

exports.deleteInquiry = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findById(req.params.id);

  if (!inquiry) {
    return res.status(404).json({
      success: false,
      message: 'Inquiry not found',
    });
  }

  if (inquiry.buyer.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this inquiry',
    });
  }

  await inquiry.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Inquiry deleted successfully',
  });
});