const express = require("express");
const BikePolicyForm = require('../models/bikePayment');
const router = express.Router();

// 🔹 Create a new form (POST)
router.post('/', async (req, res) => {
  try {
    const form = new BikePolicyForm(req.body);
    await form.save();
    res.status(201).json(form);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔹 Get all forms by userId (GET)
router.get('/user/:userId', async (req, res) => {
  try {
    const forms = await BikePolicyForm.find({ userId: req.params.userId });
    res.json(forms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Get a single form by ID (GET)
router.get('/api/bike-policy-form/:id', async (req, res) => {
  try {
    const form = await BikePolicyForm.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.json(form);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Update a form by ID (PUT)
router.put('/api/bike-policy-form/:id', async (req, res) => {
  try {
    const form = await BikePolicyForm.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.json(form);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔹 Delete a form by ID (DELETE)
router.delete('/api/bike-policy-form/:id', async (req, res) => {
  try {
    const form = await BikePolicyForm.findByIdAndDelete(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.json({ message: 'Form deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add this at the end
module.exports = router;
