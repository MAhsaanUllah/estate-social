const Review = require('../models/Review');
const User = require('../models/User');
const Inquiry = require('../models/Inquiry');
const asyncHandler = require('../middleware/asyncHandler');

exports.getAgentReviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const [reviews, total] = await Promise.all([
    Review.find({ agent: req.params.id })
      .populate('reviewer', 'name avatar')
      .populate('listing', 'title')
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Review.countDocuments({ agent: req.params.id }),
  ]);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  res.status(200).json({
    success: true,
    reviews,
    total,
    totalPages: Math.ceil(total / limitNum),
    page: pageNum,
    avgRating: Number(avgRating),
  });
});

exports.createReview = asyncHandler(async (req, res) => {
  const { agent: agentId, rating, comment, listing: listingId } = req.body;

  if (agentId === req.user.id) {
    return res.status(400).json({
      success: false,
      message: 'Cannot review yourself',
    });
  }

  const agent = await User.findById(agentId);
  if (!agent || (agent.role !== 'agent' && agent.role !== 'admin')) {
    return res.status(404).json({
      success: false,
      message: 'Agent not found',
    });
  }

  const existingReview = await Review.findOne({ agent: agentId, reviewer: req.user.id });
  if (existingReview) {
    return res.status(400).json({
      success: false,
      message: 'You have already reviewed this agent',
    });
  }

  let isVerifiedClient = false;
  if (listingId) {
    const closedInquiry = await Inquiry.findOne({
      listing: listingId,
      buyer: req.user.id,
      seller: agentId,
      status: 'Closed',
    });
    if (closedInquiry) isVerifiedClient = true;
  }

  const review = await Review.create({
    agent: agentId,
    reviewer: req.user.id,
    listing: listingId || undefined,
    rating,
    comment,
    isVerifiedClient,
  });

  await review.populate('reviewer', 'name avatar');

  res.status(201).json({
    success: true,
    review,
  });
});

exports.updateReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found',
    });
  }

  if (review.reviewer.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this review',
    });
  }

  review.rating = rating;
  review.comment = comment;
  await review.save();

  await review.populate('reviewer', 'name avatar');

  res.status(200).json({
    success: true,
    review,
  });
});

exports.deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found',
    });
  }

  if (review.reviewer.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this review',
    });
  }

  await review.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Review deleted successfully',
  });
});

exports.respondToReview = asyncHandler(async (req, res) => {
  const { response } = req.body;

  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found',
    });
  }

  if (review.agent.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to respond to this review',
    });
  }

  review.response = response;
  review.respondedAt = new Date();
  await review.save();

  await review.populate('reviewer', 'name avatar');

  res.status(200).json({
    success: true,
    review,
  });
});