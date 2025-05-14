// backend/routes/payment.js or directly in your app.js
const express = require('express');
const Razorpay = require('razorpay');
const router = express.Router();

const razorpay = new Razorpay({
  key_id: 'rzp_test_7Hbs0bQhstZUoC',       // replace with your real Razorpay key
  key_secret: 'RNjCcux6BSVUOW59mXozVCZw',             // NEVER expose this to frontend
});

router.post('/create-order', async (req, res) => {
    const { amount } = req.body;
  
    if (!amount) return res.status(400).json({ error: 'Amount required' });
  
    const options = {
      amount: amount * 100, // Razorpay requires amount in paise
      currency: 'INR',
      receipt: `receipt_order_${Math.floor(Math.random() * 1000000)}`,
    };
  
    try {
      const order = await razorpay.orders.create(options);
      res.status(200).json(order);
    } catch (err) {
      console.error('Error creating Razorpay order:', err);
      res.status(500).json({ error: 'Failed to create order' });
    }
  });
  
  module.exports = router;
