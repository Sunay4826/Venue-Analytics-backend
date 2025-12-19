// const express = require('express');
// const router = express.Router();
// const Member = require('../models/Member');
// const Booking = require('../models/Booking');
// const Transaction = require('../models/Transaction');
// const Venue = require('../models/Venue');

// // Get dashboard statistics
// router.get('/stats', async (req, res) => {
//   try {
//     // Active and Inactive Members
//     const activeMembers = await Member.countDocuments({ status: 'Active' });
//     const inactiveMembers = await Member.countDocuments({ status: 'Inactive' });
    
//     // Trial Conversion Rate
//     const totalTrialUsers = await Member.countDocuments({ is_trial_user: true });
//     const convertedTrialUsers = await Member.countDocuments({ 
//       is_trial_user: true, 
//       converted_from_trial: true 
//     });
//     const trialConversionRate = totalTrialUsers > 0 
//       ? ((convertedTrialUsers / totalTrialUsers) * 100).toFixed(2) 
//       : '0.00';
    
//     // Coaching Revenue
//     const coachingTransactions = await Transaction.find({ 
//       type: 'Coaching', 
//       status: 'Success' 
//     });
//     const coachingRevenue = coachingTransactions.reduce((sum, t) => sum + t.amount, 0);
    
//     // Bookings count
//     const bookingsCount = await Booking.countDocuments({ status: { $in: ['Confirmed', 'Completed'] } });
    
//     // Booking Revenue (from transactions with type 'Booking' and status 'Success')
//     const bookingTransactions = await Transaction.find({ 
//       type: 'Booking', 
//       status: 'Success' 
//     });
//     const bookingRevenue = bookingTransactions.reduce((sum, t) => sum + t.amount, 0);
    
//     // Girls Utilization (assuming this means venue utilization)
//     const totalVenues = await Venue.countDocuments();
//     const venuesWithBookings = await Booking.distinct('venue_id');
//     const venueUtilization = totalVenues > 0 
//       ? ((venuesWithBookings.length / totalVenues) * 100).toFixed(2) 
//       : '0.00';
    
//     // Coupon Redemption
//     const couponBookings = await Booking.countDocuments({ 
//       $and: [
//         { coupon_code: { $exists: true } },
//         { coupon_code: { $ne: null } },
//         { coupon_code: { $ne: '' } }
//       ]
//     });
    
//     // Repeat Booking Rate
//     const memberBookings = await Booking.aggregate([
//       { $match: { status: { $in: ['Confirmed', 'Completed'] } } },
//       { $group: { _id: '$member_id', count: { $sum: 1 } } },
//       { $match: { count: { $gt: 1 } } }
//     ]);
//     const totalMembersWithBookings = await Booking.distinct('member_id');
//     const repeatBookingRate = totalMembersWithBookings.length > 0
//       ? ((memberBookings.length / totalMembersWithBookings.length) * 100).toFixed(2)
//       : '0.00';
    
//     // Total Revenue
//     const allSuccessTransactions = await Transaction.find({ status: 'Success' });
//     const totalRevenue = allSuccessTransactions.reduce((sum, t) => sum + t.amount, 0);
    
//     // Refunds & Disputes
//     const refundsAndDisputes = await Transaction.countDocuments({ 
//       status: { $in: ['Refunded', 'Dispute'] } 
//     });
    
//     res.json({
//       activeMembers,
//       inactiveMembers,
//       trialConversionRate,
//       coachingRevenue: coachingRevenue.toFixed(2),
//       bookingsCount,
//       bookingRevenue: bookingRevenue.toFixed(2),
//       venueUtilization,
//       couponRedemption: couponBookings,
//       repeatBookingRate,
//       totalRevenue: totalRevenue.toFixed(2),
//       refundsAndDisputes
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get revenue by venues
// router.get('/revenue-venues', async (req, res) => {
//   try {
//     const venues = await Venue.find().sort({ venue_id: 1 });
//     const revenueByVenue = [];
    
//     for (const venue of venues) {
//       const bookings = await Booking.find({ venue_id: venue.venue_id });
//       const bookingIds = bookings.map(b => b.booking_id);
      
//       const transactions = await Transaction.find({ 
//         booking_id: { $in: bookingIds },
//         status: 'Success'
//       });
      
//       const revenue = transactions.reduce((sum, t) => sum + t.amount, 0);
      
//       revenueByVenue.push({
//         venue_id: venue.venue_id,
//         venue_name: venue.name,
//         revenue: revenue.toFixed(2)
//       });
//     }
    
//     res.json(revenueByVenue);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();

const Member = require("../models/Member");
const Booking = require("../models/Booking");
const Transaction = require("../models/Transaction");
const Venue = require("../models/Venue");

/**
 * ===============================
 * DASHBOARD STATS
 * ===============================
 */
router.get("/stats", async (req, res) => {
  try {
    /* Active / Inactive Members */
    const activeMembers = await Member.countDocuments({ status: "Active" });
    const inactiveMembers = await Member.countDocuments({ status: "Inactive" });

    /* Trial Conversion Rate */
    const totalTrialUsers = await Member.countDocuments({ is_trial_user: true });
    const convertedTrialUsers = await Member.countDocuments({
      is_trial_user: true,
      converted_from_trial: true,
    });

    const trialConversionRate =
      totalTrialUsers > 0
        ? ((convertedTrialUsers / totalTrialUsers) * 100).toFixed(2)
        : "0.00";

    /* Coaching Revenue */
    const coachingTransactions = await Transaction.find({
      type: "Coaching",
      status: "Success",
    });

    const coachingRevenue = coachingTransactions.reduce(
      (sum, t) => sum + Number(t.amount || 0),
      0
    );

    /* Bookings Count */
    const bookingsCount = await Booking.countDocuments({
      status: { $in: ["Confirmed", "Completed"] },
    });

    /* Booking Revenue */
    const bookingTransactions = await Transaction.find({
      type: "Booking",
      status: "Success",
    });

    const bookingRevenue = bookingTransactions.reduce(
      (sum, t) => sum + Number(t.amount || 0),
      0
    );

    /* Venue Utilization */
    const totalVenues = await Venue.countDocuments();

    const venuesWithBookings = await Booking.distinct("venue_id", {
      venue_id: { $ne: null },
    });

    const venueUtilization =
      totalVenues > 0
        ? ((venuesWithBookings.length / totalVenues) * 100).toFixed(2)
        : "0.00";

    /* Coupon Redemption */
    const couponRedemption = await Booking.countDocuments({
      coupon_code: { $exists: true, $ne: "" },
    });

    /* Repeat Booking Rate */
    const memberBookings = await Booking.aggregate([
      { $match: { status: { $in: ["Confirmed", "Completed"] } } },
      { $group: { _id: "$member_id", count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } },
    ]);

    const totalMembersWithBookings = await Booking.distinct("member_id", {
      member_id: { $ne: null },
    });

    const repeatBookingRate =
      totalMembersWithBookings.length > 0
        ? (
            (memberBookings.length / totalMembersWithBookings.length) *
            100
          ).toFixed(2)
        : "0.00";

    /* Total Revenue */
    const allSuccessTransactions = await Transaction.find({
      status: "Success",
    });

    const totalRevenue = allSuccessTransactions.reduce(
      (sum, t) => sum + Number(t.amount || 0),
      0
    );

    /* Refunds & Disputes */
    const refundsAndDisputes = await Transaction.countDocuments({
      status: { $in: ["Refunded", "Dispute"] },
    });

    res.json({
      activeMembers,
      inactiveMembers,
      trialConversionRate,
      coachingRevenue: coachingRevenue.toFixed(2),
      bookingsCount,
      bookingRevenue: bookingRevenue.toFixed(2),
      venueUtilization,
      couponRedemption,
      repeatBookingRate,
      totalRevenue: totalRevenue.toFixed(2),
      refundsAndDisputes,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * ===============================
 * REVENUE BY VENUE (AGGREGATION)
 * ===============================
 */
router.get("/revenue-venues", async (req, res) => {
  try {
    // Simpler approach: Get venues and calculate revenue
    const venues = await Venue.find().sort({ venue_id: 1 });
    const revenueByVenue = [];
    
    for (const venue of venues) {
      const bookings = await Booking.find({ venue_id: venue.venue_id });
      const bookingIds = bookings.map(b => b.booking_id);
      
      const transactions = await Transaction.find({ 
        booking_id: { $in: bookingIds },
        status: 'Success'
      });
      
      const revenue = transactions.reduce((sum, t) => sum + Number(t.amount || 0), 0);
      
      revenueByVenue.push({
        venue_id: venue.venue_id,
        venue_name: venue.name,
        revenue: revenue.toFixed(2)
      });
    }
    
    res.json(revenueByVenue);
  } catch (error) {
    console.error("Revenue by venue error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
