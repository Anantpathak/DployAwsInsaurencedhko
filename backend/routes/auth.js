const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/user");
const OTP = require('../models/otp');
const {
  JWT_SECRET,
  EMAIL_SERVICE,
  EMAIL_USER,
  EMAIL_PASS,
} = require("../config/config");
const { auth } = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const crypto = require('crypto'); // Import the crypto module

const router = express.Router();

// Store OTPs with expiration time (5 minutes)
const otpStorage = {};  // { mobileNumber: { otp, expiresAt } }

// Function to generate OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
};


module.exports = router;
