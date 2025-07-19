const express = require('express');
const { registerDonor, findDonors } = require('../models/donorModels');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const donor = await registerDonor(req.body);
    res.status(201).json({ message: 'Donor registered successfully!', donor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to register donor' });
  }
});

router.get('/', async (req, res) => {
  const { bloodgroup, city } = req.query;
  if (!city) return res.status(400).json({ message: 'City is required' });
  try {
    const donors = await findDonors(bloodgroup || null, city);
    res.json(donors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch donors' });
  }
});

module.exports = router;