const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { registerUser, isEmailTaken, findUserByEmail } = require('../models/userAuthModels');
const router = express.Router();

router.post('/signup', async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match' });
  try {
    if (await isEmailTaken(email)) return res.status(409).json({ message: 'Email already registered' });
    await registerUser({ username, email, password });
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Signup failed' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });
    if (!(await bcrypt.compare(password, user.password))) return res.status(400).json({ message: 'Invalid email or password' });
    const token = jwt.sign({ id: user.id, email: user.email, isAdmin: user.is_admin }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed' });
  }
});

module.exports = router;