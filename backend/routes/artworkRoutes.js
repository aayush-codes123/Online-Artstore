const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/multer');
const auth = require('../middleware/authMiddleware');
const artworkController = require('../controllers/artworkController');
const {
  createArtwork,
  getMyArtworks,
  deleteArtwork,
  updateArtwork,
} = require('../controllers/artworkController');

// POST new artwork
router.post('/', auth, upload.single('image'), createArtwork);

// GET explore/public artworks (Specific route)
router.get('/explore', artworkController.getAllArtworksPublic);

// GET all artworks by seller (Specific route, but uses sensitive path. Actually '/' is distinct from '/:id')
// However, ensure 'explore' isn't caught by ':id' if they were on same level.
// Here:
// /api/artworks/ (GET) -> getMyArtworks
// /api/artworks/explore -> getAllArtworksPublic
// /api/artworks/:id -> getArtworkById

// Wait, if I request /api/artworks/explore, will it match /:id? Yes.
// So /explore MUST be defined BEFORE /:id.

router.get('/', auth, getMyArtworks);

// DELETE artwork by ID
router.delete('/:id', auth, deleteArtwork);

// PUT update artwork by ID
router.put('/:id', auth, upload.single('image'), updateArtwork);

// GET by ID (Generic parameter route - Must be last)
router.get('/:id', artworkController.getArtworkById);

module.exports = router;
