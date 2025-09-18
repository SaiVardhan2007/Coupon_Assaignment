const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register Route
router.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phoneNumber, currentStudies, city, state } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = new User({ name, email, password, phoneNumber, currentStudies, city, state });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login Route
router.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if this is admin login
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const payload = {
        user: {
          id: 'admin',
          role: 'admin',
          email: email,
        },
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
      return res.json({ token });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    let role = user.role;
    if (email === process.env.ADMIN_EMAIL) {
      role = 'admin';
    }
    const payload = {
      user: {
        id: user._id,
        role,
        email: user.email,
      },
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
