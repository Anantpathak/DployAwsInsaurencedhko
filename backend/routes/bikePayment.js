const express = require('express');
const router = express.Router();
const BikePolicyForm = require('../models/bikePayment');

// Create a new bike policy form
router.post('/', async (req, res) => {
  try {
    const { userId, bikePolicyId, loan, name, email, address, registrationNumber, pan, dob, rto, amount } = req.body;

    // Basic validation
    if (!userId || !bikePolicyId || !name || !email || !address || !registrationNumber || !pan || !dob || !rto || !amount) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    const form = new BikePolicyForm({
      userId,
      bikePolicyId,
      loan,
      name,
      email,
      address,
      registrationNumber,
      pan,
      dob,
      rto,
      amount,
    });

    const saved = await form.save();
    res.status(201).json({ message: 'Bike policy form created successfully', data: saved });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ error: 'Duplicate registration number', details: err.message });
    } else {
      res.status(500).json({ error: 'Creation failed', details: err.message });
    }
  }
});

// Get all forms by userId
router.get('/user/:userId', async (req, res) => {
  try {
    const forms = await BikePolicyForm.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    if (!forms || forms.length === 0) {
      return res.status(404).json({ message: 'No records found for this user' });
    }
    res.status(200).json(forms);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch by userId', details: err.message });
  }
});

// Get a single form by ID
router.get('/:id', async (req, res) => {
  try {
    const form = await BikePolicyForm.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.status(200).json(form);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch by ID', details: err.message });
  }
});

// Update a form by ID
router.put('/:id', async (req, res) => {
  try {
    const updated = await BikePolicyForm.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Form not found' });
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

// Delete a form by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await BikePolicyForm.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed', details: err.message });
  }
});

module.exports = router;