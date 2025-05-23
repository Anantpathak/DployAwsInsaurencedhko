const express = require("express");
const { check, validationResult } = require("express-validator");
const InvestmentPayment = require("../models/investmentPayment");

const router = express.Router();

// Middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// CREATE
router.post(
  "/",
  [
    check("userId").notEmpty(),
    check("investmentId").notEmpty(),
    check("name").notEmpty(),
    check("email").isEmail(),
    check("mobile").isLength({ min: 10, max: 10 }).isNumeric(),
    check("address").notEmpty(),
    check("dob").notEmpty(),
    check("pan").matches(/^[A-Z]{5}[0-9]{4}[A-Z]$/),
    check("annualIncome").isNumeric(),
    check("nomineeName").notEmpty(),
    check("nomineeRelationship").notEmpty(),
    check("amount").isNumeric(),
    check("razorpayPaymentId").notEmpty(),
    check("razorpayOrderId").notEmpty(),
    check("razorpaySignature").notEmpty(),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const payment = new InvestmentPayment(req.body);
      await payment.save();
      res.status(201).json({ message: "Investment payment created", payment });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// GET ALL FOR USER
router.get("/user/:userId", async (req, res) => {
  try {
    const payments = await InvestmentPayment.find({ userId: req.params.userId });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put(
  "/:id",
  [
    check("name").optional().notEmpty(),
    check("email").optional().isEmail(),
    check("mobile").optional().isLength({ min: 10, max: 10 }).isNumeric(),
    check("address").optional().notEmpty(),
    check("dob").optional().notEmpty(),
    check("pan").optional().matches(/^[A-Z]{5}[0-9]{4}[A-Z]$/),
    check("annualIncome").optional().isNumeric(),
    check("nomineeName").optional().notEmpty(),
    check("nomineeRelationship").optional().notEmpty(),
    check("amount").optional().isNumeric(),
    check("razorpayPaymentId").optional().notEmpty(),
    check("razorpayOrderId").optional().notEmpty(),
    check("razorpaySignature").optional().notEmpty(),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const updated = await InvestmentPayment.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!updated) return res.status(404).json({ message: "Payment not found" });
      res.json({ message: "Updated successfully", updated });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await InvestmentPayment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Payment not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;