const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  items: [
    {
      name: String,
      quantity: Number,
      unitPrice: Number,
      total: Number
    }
  ],
  discountPercent: Number,
  finalAmount: Number
}, { timestamps: true });

module.exports = mongoose.model('Bill', billSchema);

