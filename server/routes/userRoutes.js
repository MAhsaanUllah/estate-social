const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  updateProfile,
  updatePassword,
  getAgentProfile,
  getAgentsDirectory,
  submitKYC,
  getAdminVerifications,
  moderateVerification,
  getAdminStats,
} = require('../controllers/authController');

// Public agent discovery
router.get('/agents', getAgentsDirectory);

// Protected user profile & KYC
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.post('/kyc', protect, submitKYC);

// Protected admin moderation & metrics
router.get('/admin/verifications', protect, authorize('admin'), getAdminVerifications);
router.put('/admin/verifications/:id', protect, authorize('admin'), moderateVerification);
router.get('/admin/stats', protect, authorize('admin'), getAdminStats);

// Public profile lookup by ID, @username or slug
router.get('/:id', getAgentProfile);

module.exports = router;