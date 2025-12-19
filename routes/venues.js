const express = require('express');
const router = express.Router();
const Venue = require('../models/Venue');

// Get all venues
router.get('/', async (req, res) => {
  try {
    const venues = await Venue.find().sort({ venue_id: 1 });
    res.json(venues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get venue by ID
router.get('/:id', async (req, res) => {
  try {
    const venue = await Venue.findOne({ venue_id: req.params.id });
    if (!venue) {
      return res.status(404).json({ error: 'Venue not found' });
    }
    res.json(venue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

