const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const InsuranceUser = require('../models/InsuranceUser');
const { auth } = require('../middleware/auth');
const { JWT_SECRET } = require('../config/config');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, phoneNumber, gender, email, password, dateOfBirth, policyTypes, policyNumber, isAdmin } = req.body;

  try {
    const user = await InsuranceUser.create({
      name, phoneNumber, gender, email, password, dateOfBirth, policyTypes, policyNumber, isAdmin
    });

    res.status(201).json({ message: 'User registered', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await InsuranceUser.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
