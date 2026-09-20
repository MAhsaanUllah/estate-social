const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createInquiry,
  getReceivedInquiries,
  getSentInquiries,
  updateInquiry,
  deleteInquiry,
} = require('../controllers/inquiryController');

router.post('/', protect, createInquiry);
router.get('/received', protect, getReceivedInquiries);
router.get('/sent', protect, getSentInquiries);
router.put('/:id', protect, updateInquiry);
router.delete('/:id', protect, deleteInquiry);

module.exports = router;