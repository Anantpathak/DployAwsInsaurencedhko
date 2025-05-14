const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const InsuranceUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  policyTypes: [{ type: String, enum: ['car', 'health', 'bike', 'term', 'investment'] }],
  policyNumber: { type: String, },
  isAdmin: { type: Boolean, default: false },
}, { timestamps: true });

// Hash password before saving
InsuranceUserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('InsuranceUser', InsuranceUserSchema);
