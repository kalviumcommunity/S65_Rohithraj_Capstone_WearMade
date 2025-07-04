const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['customer', 'tailor'],
    default: 'customer'
  },
  avatar: {
    type: String,
    trim: true,
    default: ""
  },
  bio: String,
  socialLinks: {
    facebook: String,
    instagram: String,
    twitter: String,
    linkedin: String
  },
  location: {
    address: String,
    city: String,
    state: String,
    country: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  averageRating: {
    type: Number,
    default: 0
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  portfolioImages: [String] // For tailors, optional
}, {
  timestamps: true
});


const User = mongoose.model('User', userSchema);

module.exports = User;
