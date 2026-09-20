const express = require('express');
const router = express.Router();
const { protect, authorize, optionalAuth } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');
const {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getMyListings,
  getAgentListings,
  getTrending,
  getLocations,
} = require('../controllers/listingController');

// Specific routes BEFORE /:id
router.get('/trending', getTrending);
router.get('/locations', getLocations);
router.get('/my-listings', protect, getMyListings);
router.get('/agent/:id', getAgentListings);

router.get('/', optionalAuth, getListings);
router.get('/:id', optionalAuth, getListingById);
// Persona: agents AND individual owners (buyers/sellers) can list — any authenticated user
router.post('/', protect, upload.array('images', 10), createListing);
router.put('/:id', protect, upload.array('images', 10), updateListing);
router.delete('/:id', protect, deleteListing);

module.exports = router;