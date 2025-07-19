const express = require('express');
const nodemailer = require('nodemailer');
const { createCampRequest } = require('../models/campRequestModels');
const { findDonors } = require('../models/donorModels');
const router = express.Router();

router.post('/', async (req, res) => {
  const { campname, date, city } = req.body;
  try {
    await createCampRequest({ campname, date, city });
    const donors = await findDonors(null, city);
    if (!donors.length) return res.json({ message: 'Camp organized, no donors' });

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', port: 587, secure: false,
      auth: { user: process.env.EMAIL, pass: process.env.PASSWORD }
    });
    for (const donor of donors) {
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: donor.email,
        subject: 'Blood Donation Camp',
        text: `Camp: ${campname}, Date: ${date}, City: ${city}`
      });
    }
    res.json({ message: 'Camp emails sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Camp request failed' });
  }
});

module.exports = router;
