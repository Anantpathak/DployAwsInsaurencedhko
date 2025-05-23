const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const InsuranceUser = require('../models/InsuranceUser');
const { auth } = require('../middleware/auth');
const { JWT_SECRET } = require('../config/config');

const router = express.Router();

// Check for duplicate email, phone number, or PAN
router.post('/check-duplicate', async (req, res) => {
  const { email, phoneNumber, pan } = req.body;

  try {
    const existingEmail = await InsuranceUser.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const existingPhone = await InsuranceUser.findOne({ phoneNumber });
    if (existingPhone) {
      return res.status(400).json({ error: 'Phone number already exists' });
    }

    const existingPan = await InsuranceUser.findOne({ pan });
    if (existingPan) {
      return res.status(400).json({ error: 'PAN already exists' });
    }

    res.status(200).json({ message: 'No duplicates found' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Register
router.post('/register', async (req, res) => {
  const { name, phoneNumber, gender, email, password, dateOfBirth, pan, policyTypes, policyNumber, isAdmin } = req.body;

  try {
    // Validate PAN format
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(pan)) {
      return res.status(400).json({ error: 'Invalid PAN format. It should be 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F)' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const user = await InsuranceUser.create({
      name,
      phoneNumber,
      gender,
      email,
      password,
      dateOfBirth,
      pan,
      policyTypes,
      policyNumber,
      isAdmin
    });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ message: 'User registered', user, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await InsuranceUser.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Email not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid password', emailExists: true });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Forgot Password - Verify email and phone number
router.post('/forgot-password/verify', async (req, res) => {
  const { email, phoneNumber } = req.body;

  try {
    const user = await InsuranceUser.findOne({ email, phoneNumber });
    if (!user) {
      return res.status(400).json({ error: 'Email and phone number do not match any user' });
    }

    res.status(200).json({ message: 'User verified', userId: user._id });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Forgot Password - Reset password
router.post('/forgot-password/reset', async (req, res) => {
  const { userId, newPassword } = req.body;

  try {
    // Validate password length
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const user = await InsuranceUser.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.password = newPassword; // Password will be hashed by the pre-save middleware
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all users (admin only)
router.get('/', auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ error: 'Unauthorized' });

  const users = await InsuranceUser.find();
  res.json(users);
});

// Get one user
router.get('/:id', auth, async (req, res) => {
  const user = await InsuranceUser.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// Update user
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await InsuranceUser.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete user
router.delete('/:id', auth, async (req, res) => {
  await InsuranceUser.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
});

module.exports = router;