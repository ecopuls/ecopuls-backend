const express = require('express');
const router = express.Router();
const CustomProduct = require('../models/customProduct');

router.post('/', async (req, res) => {
  try {
    const newRequest = new CustomProduct(req.body);
    await newRequest.save();
    res.status(201).json({ message: 'Custom product request saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save custom request' });
  }
});

module.exports = router;
