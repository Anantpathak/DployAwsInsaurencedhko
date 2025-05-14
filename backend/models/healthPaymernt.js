const mongoose = require('mongoose');

const healthPolicyFormSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  healthPolicyId: {
    type: String,
    required: true,
  },
  name: String,
  email: String,
  address: String,
  RegisterationNumber: String,
  pan: String,
  dob: String,
  PolicyFor: String,
  Realtion:String,
}, { timestamps: true });

module.exports = mongoose.model('HealthPayment', healthPolicyFormSchema);
