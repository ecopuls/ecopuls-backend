const express = require('express');
const router = express.Router();
const Feedback = require('../models/feedback');

router.post('/', async (req, res) => {
  try {
    console.log("✅ Received feedback:", req.body);

    const newFeedback = new Feedback(req.body);
    await newFeedback.save();

    res.status(201).json({ message: 'Feedback saved successfully' });
  } catch (error) {
    console.error("❌ Error saving feedback:", error);
    res.status(500).json({ message: 'Failed to save feedback' });
  }
});

module.exports = router;
