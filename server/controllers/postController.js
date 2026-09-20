const Post = require('../models/Post');
const asyncHandler = require('../middleware/asyncHandler');

// Public: list published posts
exports.getPosts = asyncHandler(async (req, res) => {
  const { category, page = 1, limit = 9 } = req.query;

  const query = { isPublished: true };
  if (category) query.category = category;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const [posts, total] = await Promise.all([
    Post.find(query)
      .select('-content')
      .sort('-publishedAt')
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Post.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    posts,
    total,
    totalPages: Math.ceil(total / limitNum),
    page: pageNum,
  });
});

// Public: single post by slug or id + view increment
exports.getPost = asyncHandler(async (req, res) => {
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
  const query = isObjectId ? { _id: req.params.id } : { slug: req.params.id };

  const post = await Post.findOne({ ...query, isPublished: true }).lean();

  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found',
    });
  }

  await Post.findByIdAndUpdate(post._id, { $inc: { views: 1 } });

  res.status(200).json({
    success: true,
    post,
  });
});

// Admin: create
exports.createPost = asyncHandler(async (req, res) => {
  req.body.author = req.user.id;
  const post = await Post.create(req.body);
  res.status(201).json({
    success: true,
    post,
  });
});

// Admin: update
exports.updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found',
    });
  }

  res.status(200).json({
    success: true,
    post,
  });
});

// Admin: delete
exports.deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found',
    });
  }

  await post.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Post deleted successfully',
  });
});