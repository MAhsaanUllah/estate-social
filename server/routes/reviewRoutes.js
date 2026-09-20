const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getAgentReviews,
  createReview,
  updateReview,
  deleteReview,
  respondToReview,
} = require('../controllers/reviewController');

router.get('/agent/:id', getAgentReviews);
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.put('/:id/respond', protect, respondToReview);

module.exports = router;