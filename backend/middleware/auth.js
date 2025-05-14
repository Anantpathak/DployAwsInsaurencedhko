const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config");
const User = require("../models/user");
const { check } = require("express-validator");
const InsuranceUser = require('../models/InsuranceUser');

// Authentication Middleware
const auth = async (req, res, next) => {
  const token = await req.headers?.authorization?.split(" ")[1];

  if (!token) return res.status(401).send(`Token: ${token} Access denied.`);

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Decodes the token
    const user = await InsuranceUser.findById(decoded.id); // Fetches user by ID from the decoded token
    if (!user) return res.status(401).send("User not found");

    req.user = user; // Attach user to request object
    next(); // Move to the next middleware or route
  } catch (error) {
    req.user = undefined; // Ensure user is cleared in case of error
    res.status(401).send("Invalid token.");
  }
};


// Validation Middleware for Reset Password
const validateResetPassword = [
  check("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long"),
];

// Exporting middlewares
module.exports = { auth, validateResetPassword };
