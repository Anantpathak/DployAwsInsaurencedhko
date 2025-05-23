const mongoose = require('mongoose');

const carOwnerSchema = new mongoose.Schema({
  loan: { type: Boolean, default: false },
  name: { type: String, required: [true, 'Name is required'] },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format']
  },
  address: { type: String, required: [true, 'Address is required'] },
  registrationNumber: {
    type: String,
    required: [true, 'Registration Number is required'],
    unique: true,
    match: [/^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/, 'Invalid registration number format (e.g., MH12AB1234)']
  },
  pan: {
    type: String,
    required: [true, 'PAN number is required'],
    match: [/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'Invalid PAN format (e.g., ABCDE1234F)']
  },
  dob: { type: Date, required: [true, 'Date of Birth is required'] },
  rto: {
    type: String,
    required: [true, 'RTO Pincode is required'],
    match: [/^\d{6}$/, 'RTO Pincode must be exactly 6 digits']
  },
  amount: { type: Number, required: [true, 'Amount is required'], min: [0, 'Amount cannot be negative'] },
  userId: { type: String, required: [true, 'User ID is required'] },
  policyId: { type: String, required: [true, 'Policy ID is required'] } // Added policyId to link to the insurance policy
}, { timestamps: true });

// Index for faster queries
carOwnerSchema.index({ userId: 1 });
carOwnerSchema.index({ registrationNumber: 1 });

module.exports = mongoose.model('CarOwner', carOwnerSchema);