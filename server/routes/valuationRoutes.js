const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  createValuation,
  getValuations,
} = require('../controllers/valuationController');

// Public: get estimate + save lead
router.post('/', createValuation);

// Admin: valuation leads (CRM follow-up)
router.get('/', protect, authorize('admin'), getValuations);

module.exports = router;