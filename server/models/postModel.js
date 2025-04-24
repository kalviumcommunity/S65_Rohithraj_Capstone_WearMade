const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User or tailor posting
  images: [{ type: String }], // Cloudinary URLs for post images
  description: String, // Caption or post content
  tags: [{ type: String }], // e.g., ["fashion", "handmade"]
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who liked
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);