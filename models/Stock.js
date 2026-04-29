const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  ticker: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    minlength: 2,
    maxlength: 8
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  currentPrice: {
    type: Number,
    required: true,
    default: 50,
    min: 0.01
  }
}, { timestamps: true });

module.exports = mongoose.model('Stock', stockSchema);