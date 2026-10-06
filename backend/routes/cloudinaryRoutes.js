const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/multer');
const auth = require('../middleware/authMiddleware');
const {
  getCloudinaryConfig,
  uploadImage,
  uploadFromUrlOrBase64,
  deleteImage,
  getUploadSignature,
} = require('../controllers/cloudinaryController');

// Middleware to accept either 'image' or 'file' form-data field
const handleUploadField = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) return next(err);
    if (req.file) return next();
    // Try field name 'file' if 'image' was not found
    upload.single('file')(req, res, next);
  });
};

// Check Cloudinary status & cloud name (publicly readable for health checks)
router.get('/config', getCloudinaryConfig);
router.get('/status', getCloudinaryConfig);

// Direct file upload endpoint (multipart/form-data)
router.post('/upload', handleUploadField, uploadImage);

// Remote URL / Base64 upload endpoint
router.post('/upload-url', auth, uploadFromUrlOrBase64);

// Generate signature for direct client-side upload to Cloudinary
router.get('/signature', auth, getUploadSignature);
router.post('/signature', auth, getUploadSignature);

// Delete image from Cloudinary by public ID
router.delete('/:public_id', auth, deleteImage);
router.post('/delete', auth, deleteImage);

module.exports = router;
