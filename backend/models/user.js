// models/user.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  name: { type: String },
  password: { type: String },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  userType: {
    type: String,
    enum: ["staff", "admin", "customer", "vendor", "delivery_partner"],
  },
});

module.exports = mongoose.model("User", userSchema);
