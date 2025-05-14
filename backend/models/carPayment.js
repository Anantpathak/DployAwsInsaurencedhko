const mongoose = require('mongoose');

const carOwnerSchema = new mongoose.Schema({
  loan: { type: Boolean, default: false },
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String },
  RegisterationNumber: { type: String },
  pan: { type: String },
  dob: { type: Date },
  rto: { type: String },
  amount: { type: Number },
  userId: { type: String, required: true }, // From localStorage on frontend
}, { timestamps: true });

module.exports = mongoose.model('CarOwner', carOwnerSchema);
