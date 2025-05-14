const mongoose = require('mongoose');

const bikePolicyFormSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  bikePolicyId: {
    type: String,
    required: true,
  },
  loan: {
    type: Boolean,
    default: false,
  },
  name: String,
  email: String,
  address: String,
  RegisterationNumber: String,
  pan: String,
  dob: String,
  rto: String,
}, { timestamps: true });

module.exports = mongoose.model('BikePolicyForm', bikePolicyFormSchema);
