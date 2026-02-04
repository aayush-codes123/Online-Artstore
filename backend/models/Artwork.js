const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  label: String,
  status: { type: String, enum: ['Available', 'Sold'], default: 'Available' },
  verificationStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  views: { type: Number, default: 0 },
  details: {
    paperQuality: String,
    brushType: String,
    strokeCount: String
  },
  imageUrl: { type: String, required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Artwork', artworkSchema);
