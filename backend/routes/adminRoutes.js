const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');

// Protected admin routes
router.get('/dashboard-stats', authMiddleware, isAdmin, adminController.getDashboardStats);
router.get('/pending-artworks', authMiddleware, isAdmin, adminController.getPendingArtworks);
router.put('/verify-artwork/:id', authMiddleware, isAdmin, adminController.verifyArtwork);
router.get('/sellers', authMiddleware, isAdmin, adminController.getAllSellers);
router.delete('/sellers/:id', authMiddleware, isAdmin, adminController.deleteSeller);

module.exports = router;
