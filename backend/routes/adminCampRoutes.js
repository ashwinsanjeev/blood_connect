require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const {getPendingCampRequests, approveCampRequest, deleteCampRequest} = require('../models/campRequestModels');
const { findDonors } = require('../models/donorModels');

const router = express.Router();

// List all pending requests
router.get('/', async (req, res) => {
  try {
    const pending = await getPendingCampRequests();
    res.json(pending);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load requests' });
  }
});

// Approve one
router.post('/:id/approve', async (req, res) => {
  const id = req.params.id;
  try {
    const camp = await approveCampRequest(id);
    // notify donors now that it's approved
    const donors = await findDonors(null, camp.city);
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', port: 587, secure: false,
      auth: { user: process.env.EMAIL, pass: process.env.PASSWORD }
    });
    for (const d of donors) {
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: d.email,
        subject: 'New Blood Donation Camp',
        text: `Dear ${d.name},\n\nA blood donation camp has been scheduled:\nEvent: ${camp.campname}\nDate: ${camp.date}\nCity: ${camp.city}\n\nPlease join us!\n`
      });
    }
    res.json({ message: 'Request approved and donors notified' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Approval failed' });
  }
});

// Delete one
router.delete('/:id', async (req, res) => {
  try {
    await deleteCampRequest(req.params.id);
    res.json({ message: 'Request deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Deletion failed' });
  }
});

module.exports = router;
