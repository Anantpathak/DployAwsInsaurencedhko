const express = require('express');
const Razorpay = require('razorpay');
const Payment = require('../models/Payment'); // Adjust the path to your Payment model
const router = express.Router();

const razorpay = new Razorpay({
  key_id: 'rzp_test_7Hbs0bQhstZUoC',       // Replace with your real Razorpay key
  key_secret: 'RNjCcux6BSVUOW59mXozVCZw', // NEVER expose this to frontend
});

router.post('/create-order', async (req, res) => {
    const { amount } = req.body;

    // Validate amount
    if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: 'Amount must be a positive number' });
    }

    // Convert to paise and round to the nearest integer
    const amountInPaise = Math.round(parseFloat(amount) * 100);

    const options = {
        amount: amountInPaise, // Ensure amount is an integer in paise
        currency: 'INR',
        receipt: `receipt_order_${Math.floor(Math.random() * 1000000)}`,
    };

    try {
        const order = await razorpay.orders.create(options);
        res.status(200).json(order);
    } catch (err) {
        console.error('Error creating Razorpay order:', err.message, err.stack);
        res.status(500).json({ 
            error: 'Failed to create order', 
            details: err.message 
        });
    }
});

router.post('/save', async (req, res) => {
    const {
        policyNumber,
        insuredName,
        insuranceType,
        paymentAmount,
        paymentDate,
        paymentMethod,
        transactionId,
        userID,
    } = req.body;

    try {
        const payment = new Payment({
            policyNumber,
            insuredName,
            insuranceType,
            paymentAmount,
            paymentDate,
            paymentMethod,
            transactionId,
            userID,
        });
        await payment.save();
        res.status(201).json({ message: 'Payment saved successfully', payment });
    } catch (err) {
        console.error('Error saving payment:', err);
        res.status(500).json({ error: 'Failed to save payment', details: err.message });
    }
});

module.exports = router;