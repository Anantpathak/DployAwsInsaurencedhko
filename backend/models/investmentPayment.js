const mongoose = require('mongoose');

const investmentPaymentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  investmentId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  pan: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  annualIncome: {
    type: Number,
    required: true,
  },
  nomineeName: {
    type: String,
    required: true,
  },
  nomineeRelationship: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  razorpayPaymentId: {
    type: String,
    required: true,
  },
  razorpayOrderId: {
    type: String,
    required: true,
  },
  razorpaySignature: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('InvestmentPayment', investmentPaymentSchema);