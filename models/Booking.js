const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  booking_id: {
    type: Number,
    required: true,
    unique: true
  },
  venue_id: {
    type: Number,
    required: true,
    ref: 'Venue'
  },
  sport_id: {
    type: Number,
    required: true
  },
  member_id: {
    type: Number,
    required: true,
    ref: 'Member'
  },
  booking_date: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  coupon_code: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Confirmed', 'Completed', 'Cancelled'],
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);

