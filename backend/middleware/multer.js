const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, JPG, PNG, and WEBP images are allowed'), false);
  }
};

const getStorage = () => {
  if (isCloudinaryConfigured()) {
    return new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: process.env.CLOUDINARY_FOLDER || 'artstore_artworks',
        allowed_formats: ['jpeg', 'jpg', 'png', 'webp'],
      },
    });
  }

  // Fallback to local storage (for local development without Cloudinary credentials)
  const uploadDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  if (process.env.VERCEL) {
    console.warn(
      '⚠️ Warning: Cloudinary is not configured on Vercel. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in Vercel environment variables.'
    );
  }

  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const sanitized = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
      cb(null, `${Date.now()}-${sanitized}`);
    },
  });
};

const upload = multer({
  storage: getStorage(),
  fileFilter: fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB limit
});

module.exports = {
  upload,
  fileFilter,
  getStorage,
};
