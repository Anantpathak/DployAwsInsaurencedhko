const express = require('express');
const router = express.Router();
const CarOwner = require('../models/healthPaymernt');

// Create
router.post('/', async (req, res) => {
  try {
    const newOwner = new CarOwner(req.body);
    const saved = await newOwner.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Creation failed', details: err.message });
  }
});

// Read All
router.get('/', async (req, res) => {
  try {
    const owners = await CarOwner.find();
    res.json(owners);
  } catch (err) {
    res.status(500).json({ error: 'Fetch failed' });
  }
});

// Get By User ID
router.get('/user/:userId', async (req, res) => {
  try {
    const data = await CarOwner.findOne({ userId: req.params.userId });
    if (!data) return res.status(404).json({ message: 'Not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Fetch by userId failed' });
  }
});

// Get by DB ID
router.get('/:id', async (req, res) => {
  try {
    const owner = await CarOwner.findById(req.params.id);
    if (!owner) return res.status(404).json({ message: 'Not found' });
    res.json(owner);
  } catch (err) {
    res.status(500).json({ error: 'Fetch by ID failed' });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const updated = await CarOwner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    await CarOwner.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;
