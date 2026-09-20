const User = require('../models/User');
const Listing = require('../models/Listing');
const Inquiry = require('../models/Inquiry');
const asyncHandler = require('../middleware/asyncHandler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const RESERVED_USERNAMES = [
  'admin', 'administrator', 'root', 'api', 'login', 'signin', 'signup',
  'register', 'dashboard', 'settings', 'listing', 'listings', 'feed',
  'success', 'about', 'contact', 'terms', 'privacy', 'help', 'blog',
  'valuation', 'calculator', 'agents', 'agent', 'profile', 'null',
  'undefined', 'estatesocial', 'support', 'official', 'auth', 'user'
];

const PUBLIC_AGENT_FIELDS = [
  'name', 'username', 'slug', 'role', 'agencyName', 'city', 'address',
  'avatar', 'coverImage', 'bio', 'designation', 'verified', 'socialLinks',
  'videoTours', 'rating', 'reviewsCount', 'dealsClosed', 'createdAt'
].join(' ');

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? null : 'estatesocial_dev_secret_2026');
  if (!secret) {
    throw new Error('JWT_SECRET must be configured in environment variables');
  }
  return jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRE) || 7) * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  };

  res.cookie('token', token, cookieOptions);

  res.status(statusCode).json({
    success: true,
    token: token,
    accessToken: token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      slug: user.slug,
      role: user.role,
      phone: user.phone,
      city: user.city,
      agencyName: user.agencyName,
      avatar: user.avatar,
      coverImage: user.coverImage,
      bio: user.bio,
      verified: user.verified,
      kycStatus: user.kycStatus,
    },
  });
};

const sanitizeUsername = (input) => {
  return (input || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

const generateUniqueUsername = async (base) => {
  let cleaned = sanitizeUsername(base || 'agent');
  if (cleaned.length < 3) cleaned = `agent-${cleaned || 'user'}`;
  if (cleaned.length > 25) cleaned = cleaned.substring(0, 25);

  if (RESERVED_USERNAMES.includes(cleaned)) {
    cleaned = `${cleaned}-pk`;
  }

  let candidate = cleaned;
  let exists = await User.findOne({ $or: [{ username: candidate }, { slug: candidate }] });
  let count = 1;

  while (exists) {
    candidate = `${cleaned}-${count}`;
    exists = await User.findOne({ $or: [{ username: candidate }, { slug: candidate }] });
    count++;
  }

  return candidate;
};

// POST /api/auth/register
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, agencyName, city, role, username } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, email, and password',
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long',
    });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'Email already registered',
    });
  }

  let finalUsername;
  if (username) {
    finalUsername = sanitizeUsername(username);
    if (finalUsername.length < 3 || finalUsername.length > 30) {
      return res.status(400).json({
        success: false,
        message: 'Username must be between 3 and 30 alphanumeric characters',
      });
    }
    if (RESERVED_USERNAMES.includes(finalUsername)) {
      return res.status(400).json({
        success: false,
        message: 'This username is reserved by the platform. Please choose another.',
      });
    }
    const userExists = await User.findOne({ $or: [{ username: finalUsername }, { slug: finalUsername }] });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Username is already taken. Please choose another.',
      });
    }
  } else {
    finalUsername = await generateUniqueUsername(agencyName || name);
  }

  // Strictly disallow self-assigning admin role
  const safeRole = ['agent', 'owner'].includes(role) ? role : 'buyer';
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    username: finalUsername,
    slug: finalUsername,
    phone: phone ? phone.trim() : '',
    agencyName: agencyName ? agencyName.trim() : '',
    city: city ? city.trim() : '',
    role: safeRole,
    verified: false,
    kycStatus: 'Unverified',
    socialLinks: {
      whatsapp: phone ? phone.trim() : '',
    },
  });

  sendTokenResponse(user, 201, res);
});

// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password',
    });
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Account is deactivated. Please contact support.',
    });
  }

  user.lastLogin = Date.now();
  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res);
});

// POST /api/auth/logout
exports.logout = asyncHandler(async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

// GET /api/auth/me
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('+kycData');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// PUT /api/users/profile or /api/auth/profile
exports.updateProfile = asyncHandler(async (req, res) => {
  const allowedUpdates = [
    'name', 'phone', 'agencyName', 'city', 'address', 'bio',
    'avatar', 'coverImage', 'designation', 'socialLinks', 'videoTours'
  ];

  const fieldsToUpdate = {};
  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      fieldsToUpdate[field] = req.body[field];
    }
  });

  // Sanitize URLs in socialLinks and avatar to block javascript: schemes
  if (fieldsToUpdate.avatar && typeof fieldsToUpdate.avatar === 'string') {
    if (!fieldsToUpdate.avatar.startsWith('http://') && !fieldsToUpdate.avatar.startsWith('https://')) {
      fieldsToUpdate.avatar = '';
    }
  }

  if (req.body.username) {
    const cleanUsername = sanitizeUsername(req.body.username);
    if (cleanUsername.length < 3 || cleanUsername.length > 30) {
      return res.status(400).json({
        success: false,
        message: 'Username must be between 3 and 30 alphanumeric characters',
      });
    }
    if (RESERVED_USERNAMES.includes(cleanUsername)) {
      return res.status(400).json({
        success: false,
        message: 'This username is reserved by the platform',
      });
    }
    if (cleanUsername !== req.user.username) {
      const exists = await User.findOne({ 
        $or: [{ username: cleanUsername }, { slug: cleanUsername }], 
        _id: { $ne: req.user.id } 
      });
      if (exists) {
        return res.status(400).json({
          success: false,
          message: 'Username is already taken',
        });
      }
      fieldsToUpdate.username = cleanUsername;
      fieldsToUpdate.slug = cleanUsername;
    }
  }

  // MASS ASSIGNMENT DEFENSE: Delete any protected fields that may have been sent
  delete fieldsToUpdate.role;
  delete fieldsToUpdate.verified;
  delete fieldsToUpdate.kycStatus;
  delete fieldsToUpdate.kycData;
  delete fieldsToUpdate.password;
  delete fieldsToUpdate.isAdmin;
  delete fieldsToUpdate._id;
  delete fieldsToUpdate.isActive;

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

// PUT /api/users/password or /api/auth/password
exports.updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both current and new passwords',
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 6 characters long',
    });
  }

  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.comparePassword(currentPassword))) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect',
    });
  }

  user.password = await bcrypt.hash(newPassword, 12);
  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res);
});

// GET /api/users/:id or @username or slug — Public Profile
exports.getAgentProfile = asyncHandler(async (req, res) => {
  const param = req.params.id;

  let query = {};
  if (param.startsWith('@')) {
    const handle = sanitizeUsername(param.substring(1));
    query = { $or: [{ username: handle }, { slug: handle }] };
  } else if (param.match(/^[0-9a-fA-F]{24}$/)) {
    query = { $or: [{ _id: param }, { username: sanitizeUsername(param) }, { slug: sanitizeUsername(param) }] };
  } else {
    query = { $or: [{ username: sanitizeUsername(param) }, { slug: sanitizeUsername(param) }] };
  }

  // PRIVACY: Explicitly project ONLY public fields (never kycData, CNIC, password, email)
  const agent = await User.findOne(query).select(PUBLIC_AGENT_FIELDS);

  if (!agent) {
    return res.status(404).json({
      success: false,
      message: 'Agent profile not found',
    });
  }

  // Count active listings
  const activeListingsCount = await Listing.countDocuments({ creator: agent._id, status: 'Active' });

  res.status(200).json({
    success: true,
    user: {
      ...agent.toObject(),
      activeListingsCount,
    },
  });
});

// GET /api/users/agents — Directory of verified public agents
exports.getAgentsDirectory = asyncHandler(async (req, res) => {
  const { city, search, page = 1, limit = 20 } = req.query;

  const query = { role: { $in: ['agent', 'admin'] }, isActive: true };
  if (city && typeof city === 'string') {
    const cleanCity = city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').trim();
    query.city = { $regex: cleanCity, $options: 'i' };
  }
  if (search && typeof search === 'string') {
    const cleanSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').trim();
    query.$or = [
      { name: { $regex: cleanSearch, $options: 'i' } },
      { agencyName: { $regex: cleanSearch, $options: 'i' } },
      { city: { $regex: cleanSearch, $options: 'i' } },
      { username: { $regex: cleanSearch, $options: 'i' } },
    ];
  }

  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 20));
  const skip = (pageNum - 1) * limitNum;

  // PRIVACY: Select ONLY public agent fields
  const [agents, total] = await Promise.all([
    User.find(query)
      .select(PUBLIC_AGENT_FIELDS)
      .sort('-verified -rating -createdAt')
      .skip(skip)
      .limit(limitNum)
      .lean(),
    User.countDocuments(query),
  ]);

  // Aggregate listings count for each agent
  const agentIds = agents.map((a) => a._id);
  const counts = await Listing.aggregate([
    { $match: { creator: { $in: agentIds }, status: 'Active' } },
    { $group: { _id: '$creator', count: { $sum: 1 } } },
  ]);

  const countMap = {};
  counts.forEach((c) => { countMap[c._id.toString()] = c.count; });

  const enrichedAgents = agents.map((a) => ({
    ...a,
    activeListingsCount: countMap[a._id.toString()] || 0,
  }));

  res.status(200).json({
    success: true,
    agents: enrichedAgents,
    total,
    totalPages: Math.ceil(total / limitNum),
    page: pageNum,
  });
});

// POST /api/users/kyc — Submit Verification documents (Authenticated User)
exports.submitKYC = asyncHandler(async (req, res) => {
  const { cnic, ntn, certificateType, allotmentInfo, documentUrl, docUrl } = req.body;

  if (!cnic || typeof cnic !== 'string' || cnic.trim().length < 13) {
    return res.status(400).json({
      success: false,
      message: 'Valid Pakistani CNIC number (e.g. 35201-1234567-1) is required',
    });
  }

  const rawUrl = documentUrl || docUrl;
  let safeDocUrl = '';
  if (rawUrl && typeof rawUrl === 'string') {
    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
      safeDocUrl = rawUrl.trim().substring(0, 500);
    }
  }

  // If a file was uploaded via multipart/form-data:
  if (req.file) {
    safeDocUrl = req.file.path;
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      kycStatus: 'Pending',
      verified: false, // Never auto-verify upon submission
      kycData: {
        cnic: cnic.trim().substring(0, 30),
        ntn: ntn ? ntn.trim().substring(0, 50) : '',
        certificateType: certificateType ? certificateType.trim().substring(0, 100) : 'CNIC Photo',
        allotmentInfo: allotmentInfo ? allotmentInfo.trim().substring(0, 150) : '',
        documentUrl: safeDocUrl,
        submittedAt: new Date(),
      },
    },
    { new: true }
  ).select('+kycData');

  res.status(200).json({
    success: true,
    message: 'Identity documents submitted for moderation review',
    user: updatedUser,
  });
});

// GET /api/users/admin/verifications — Admin-only KYC Queue
exports.getAdminVerifications = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = {};
  if (status && status !== 'All') {
    query.kycStatus = status;
  } else {
    query.kycStatus = { $in: ['Pending', 'Approved', 'Rejected'] };
  }

  // Admin view explicitly retrieves kycData for review
  const users = await User.find(query)
    .select('+kycData name email phone role city agencyName verified kycStatus kycData createdAt')
    .sort('-kycData.submittedAt -createdAt')
    .lean();

  res.status(200).json({
    success: true,
    verifications: users,
  });
});

// PUT /api/users/admin/verifications/:id — Approve / Reject Verification (Admin only)
exports.moderateVerification = asyncHandler(async (req, res) => {
  let { status, action, rejectionReason } = req.body;
  if (!status && action) {
    if (action === 'approve') status = 'Approved';
    else if (action === 'reject') status = 'Rejected';
  }

  if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid verification status. Must be Approved, Rejected, or Pending.',
    });
  }

  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid User ID',
    });
  }

  const user = await User.findById(req.params.id).select('+kycData');
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  user.kycStatus = status;
  user.verified = status === 'Approved';
  if (!user.kycData) user.kycData = {};
  user.kycData.reviewedAt = new Date();
  if (rejectionReason) user.kycData.rejectionReason = rejectionReason.trim().substring(0, 300);

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: `Verification ${status.toLowerCase()} successfully`,
    user,
  });
});

// GET /api/users/admin/stats — Real Database KPI Metrics (Admin only)
exports.getAdminStats = asyncHandler(async (req, res) => {
  const [totalListings, activeListings, totalUsers, verifiedAgents, pendingKYC, totalInquiries] = await Promise.all([
    Listing.countDocuments(),
    Listing.countDocuments({ status: 'Active' }),
    User.countDocuments({ role: { $ne: 'admin' } }),
    User.countDocuments({ verified: true, role: 'agent' }),
    User.countDocuments({ kycStatus: 'Pending' }),
    Inquiry.countDocuments(),
  ]);

  res.status(200).json({
    success: true,
    stats: {
      totalListings,
      activeListings,
      totalUsers,
      verifiedAgents,
      pendingKYC,
      totalInquiries,
    },
  });
});

// POST /api/auth/refresh
exports.refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided',
    });
  }

  try {
    const secret = process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? null : 'estatesocial_dev_secret_2026');
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive',
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
});