const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transaction_id: {
    type: Number,
    required: true,
    unique: true
  },
  booking_id: {
    type: Number,
    required: true,
    ref: 'Booking'
  },
  type: {
    type: String,
    enum: ['Booking', 'Coaching'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Success', 'Dispute', 'Refunded'],
    required: true
  },
  transaction_date: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);

