const mongoose = require('mongoose');

const holdingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ticker: {
    type: String,
    required: true
  },
  shares: {
    type: Number,
    default: 0,
    min: 0
  }
}, { timestamps: true });

holdingSchema.index({ user: 1, ticker: 1 }, { unique: true });

module.exports = mongoose.model('Holding', holdingSchema);