const mongoose = require('mongoose');

const exploreSchema = new mongoose.Schema({
  contentType: { type: String, enum: ['Work', 'Post'], required: true }, // Indicates Work or Post
  contentId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'contentType' }, // Dynamic ref to Work or Post
  tags: [{ type: String }], // Tags for search/discovery (e.g., ["fashion", "wedding"])
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User/tailor who created the Work/Post
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Explore', exploreSchema);