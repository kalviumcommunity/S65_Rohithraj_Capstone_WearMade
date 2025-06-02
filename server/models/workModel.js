const mongoose = require('mongoose');

const workSchema = new mongoose.Schema({
  tailor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  images: [{ type: String }], // Cloudinary URLs for work photos
  title: { type: String, required: true }, // e.g., "Bespoke Wedding Gown"
  description: String, // Details about the work
  category: { type: String }, // e.g., "Bridal", "Casual", "Formal"
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Work', workSchema);