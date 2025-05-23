const express = require('express');
const router = express.Router();
const CarOwner = require('../models/carPayment');

// Create a new car owner entry
router.post('/', async (req, res) => {
  try {
    const { loan, name, email, address, registrationNumber, pan, dob, rto, amount, userId, policyId } = req.body;

    // Basic validation
    if (!name || !email || !address || !registrationNumber || !pan || !dob || !rto || !amount || !userId || !policyId) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    const newOwner = new CarOwner({
      loan,
      name,
      email,
      address,
      registrationNumber,
      pan,
      dob,
      rto,
      amount,
      userId,
      policyId
    });

    const saved = await newOwner.save();
    res.status(201).json({ message: 'Car owner created successfully', data: saved });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ error: 'Duplicate registration number', details: err.message });
    } else {
      res.status(500).json({ error: 'Creation failed', details: err.message });
    }
  }
});

// Read all car owners
router.get('/', async (req, res) => {
  try {
    const owners = await CarOwner.find().sort({ createdAt: -1 }); // Sort by creation date, newest first
    res.status(200).json(owners);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch car owners', details: err.message });
  }
});

// Get car owners by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const data = await CarOwner.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'No records found for this user' });
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch by userId', details: err.message });
  }
});

// Get car owner by DB ID
router.get('/:id', async (req, res) => {
  try {
    const owner = await CarOwner.findById(req.params.id);
    if (!owner) {
      return res.status(404).json({ message: 'Car owner not found' });
    }
    res.status(200).json(owner);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch by ID', details: err.message });
  }
});

// Update car owner by ID
router.put('/:id', async (req, res) => {
  try {
    const updated = await CarOwner.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Car owner not found' });
    }
    res.status(200).json({ message: 'Updated successfully', data: updated });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ error: 'Duplicate registration number', details: err.message });
    } else {
      res.status(500).json({ error: 'Update failed', details: err.message });
    }
  }
});

// Delete car owner by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await CarOwner.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Car owner not found' });
    }
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed', details: err.message });
  }
});

module.exports = router;