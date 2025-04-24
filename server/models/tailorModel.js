const mongoose = require('mongoose');

const tailorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  portfolio: [{ type: String }],
  ratings: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: String
  }],
  skills: [{ type: String }],
  availability: { type: Boolean, default: true },
  location: String
}, { timestamps: true });

module.exports = mongoose.model('Tailor', tailorSchema);