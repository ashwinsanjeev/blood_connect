const express = require('express');
const nodemailer = require('nodemailer');
const { createBloodRequest } = require('../models/bloodRequestModels');
const { findDonors } = require('../models/donorModels');
const router = express.Router(); 
require('dotenv').config();

router.post('/', async (req, res) => {
  const { name, bloodgroup, email, contact, city } = req.body;
  try {
    await createBloodRequest({ name, bloodgroup, email, contact, city });
    const donors = await findDonors(bloodgroup, city);
    if (!donors.length) return res.status(404).json({ message: 'No donors found' });

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', port: 587, secure: false,
      auth: { user: process.env.EMAIL, pass: process.env.PASSWORD }
    });
    for (const donor of donors) {
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: donor.email,
        subject: 'Blood Donation Request',
        text: `Dear ${donor.name}, a patient in ${city} needs ${bloodgroup}. Contact ${contact}`
      });
    }
    res.json({ message: 'Emails sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Request failed' });
  }
});

module.exports = router;