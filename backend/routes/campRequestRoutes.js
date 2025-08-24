// routes/campRequestRoutes.js
const express = require('express');
const { createCampRequest } = require('../models/campRequestModels');
const router = express.Router();

// user submits a camp request → status = 'pending'
router.post('/', async (req, res) => {
  try {
    const camp = await createCampRequest(req.body);
    res.status(201).json({ message: 'Camp request submitted', camp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to submit request' });
  }
});

module.exports = router;