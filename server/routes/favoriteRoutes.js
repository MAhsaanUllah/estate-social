const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getFavorites,
  toggleFavorite,
  clearFavorites,
} = require('../controllers/favoriteController');

router.get('/', protect, getFavorites);
router.post('/toggle', protect, toggleFavorite);
router.delete('/', protect, clearFavorites);

module.exports = router;