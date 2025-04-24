const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tailor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['requested', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled'],
    default: 'requested'
  },
  measurements: {
    height: { type: Number, required: true },
    chest: { type: Number, required: true },
    waist: { type: Number, required: true },
    hips: { type: Number, required: true },
    shoulder: { type: Number, required: true }
  },
  requirements: String,
  estimatedTime: String,
  estimatedCost: Number,
  finalCost: Number,
  deliveryAddress: String,
  rejectedReason: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);