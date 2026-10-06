const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');

/**
 * Check Cloudinary configuration status
 * GET /api/cloudinary/config
 */
const getCloudinaryConfig = async (req, res) => {
  const configured = isCloudinaryConfigured();
  return res.json({
    configured,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || null,
    folder: process.env.CLOUDINARY_FOLDER || 'artstore_artworks',
    message: configured
      ? 'Cloudinary is ready and configured.'
      : 'Cloudinary API credentials are not set. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env or Vercel dashboard.',
  });
};

/**
 * Upload single image via multipart/form-data
 * POST /api/cloudinary/upload
 */
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    const isCloudinary =
      req.file.path &&
      (req.file.path.startsWith('http://') || req.file.path.startsWith('https://'));

    const fileUrl = isCloudinary ? req.file.path : `/uploads/${req.file.filename}`;

    return res.status(200).json({
      success: true,
      url: fileUrl,
      secure_url: fileUrl,
      public_id: req.file.filename,
      isCloudinary: Boolean(isCloudinary),
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  } catch (error) {
    console.error('Upload image error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message,
    });
  }
};

/**
 * Upload image from base64 string or remote URL
 * POST /api/cloudinary/upload-url
 */
const uploadFromUrlOrBase64 = async (req, res) => {
  try {
    if (!isCloudinaryConfigured()) {
      return res.status(503).json({
        success: false,
        message: 'Cloudinary is not configured. Please set Cloudinary credentials in .env.',
      });
    }

    const { image, url, folder } = req.body;
    const fileSource = image || url;

    if (!fileSource) {
      return res.status(400).json({
        success: false,
        message: 'Please provide either "image" (base64/data URI) or "url" in request body.',
      });
    }

    const uploadResponse = await cloudinary.uploader.upload(fileSource, {
      folder: folder || process.env.CLOUDINARY_FOLDER || 'artstore_artworks',
    });

    return res.status(200).json({
      success: true,
      url: uploadResponse.secure_url,
      secure_url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
      format: uploadResponse.format,
      bytes: uploadResponse.bytes,
    });
  } catch (error) {
    console.error('Upload URL/base64 error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload to Cloudinary',
      error: error.message,
    });
  }
};

/**
 * Delete image by public ID
 * DELETE /api/cloudinary/:public_id
 * or POST /api/cloudinary/delete with { public_id }
 */
const deleteImage = async (req, res) => {
  try {
    if (!isCloudinaryConfigured()) {
      return res.status(503).json({
        success: false,
        message: 'Cloudinary is not configured.',
      });
    }

    const publicId = req.params.public_id || req.body.public_id;
    if (!publicId) {
      return res.status(400).json({ success: false, message: 'public_id is required' });
    }

    const result = await cloudinary.uploader.destroy(publicId);
    return res.json({
      success: true,
      result,
      message: 'Image deleted from Cloudinary successfully',
    });
  } catch (error) {
    console.error('Delete image error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete image from Cloudinary',
      error: error.message,
    });
  }
};

/**
 * Generate signature for direct client-to-Cloudinary upload
 * GET or POST /api/cloudinary/signature
 */
const getUploadSignature = async (req, res) => {
  try {
    if (!isCloudinaryConfigured()) {
      return res.status(503).json({
        success: false,
        message: 'Cloudinary is not configured.',
      });
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = req.body?.folder || req.query?.folder || process.env.CLOUDINARY_FOLDER || 'artstore_artworks';

    const paramsToSign = {
      timestamp,
      folder,
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    return res.json({
      success: true,
      signature,
      timestamp,
      folder,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    });
  } catch (error) {
    console.error('Signature generation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate Cloudinary signature',
      error: error.message,
    });
  }
};

module.exports = {
  getCloudinaryConfig,
  uploadImage,
  uploadFromUrlOrBase64,
  deleteImage,
  getUploadSignature,
};
