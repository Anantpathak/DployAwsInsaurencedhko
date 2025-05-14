const express = require("express");
const { check, validationResult } = require("express-validator");
const TermInsuranceProvider = require("../models/investmentInsuranceProvider");

const router = express.Router();

// Middleware for validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// CREATE
router.post(
  "/create",
  [
    check("name").notEmpty().withMessage("Name is required"),
    check("investAmountPerMonth").notEmpty().withMessage("Investment amount is required"),
    check("payFor").notEmpty().withMessage("Pay duration is required"),
    check("returnsAfter").notEmpty().withMessage("Returns after is required"),
    check("payoutType").notEmpty().withMessage("Payout type is required"),
    check("planType").notEmpty().withMessage("Plan type is required"),
    check("returnPercentage").isNumeric().withMessage("Return % must be a number"),
    check("projectedReturns").notEmpty().withMessage("Projected returns is required"),
    check("capitalGuarantee").isBoolean().withMessage("Capital Guarantee must be boolean"),
    check("otherBenefits").optional().isArray(),
    check("fundName").optional().isString(),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const provider = new TermInsuranceProvider(req.body);
      await provider.save();
      res.status(201).json({ message: "Term insurance provider created", provider });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// GET ALL
router.get("/all", async (_req, res) => {
  try {
    const providers = await TermInsuranceProvider.find();
    res.json(providers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// FILTER
router.get("/filter", async (req, res) => {
  try {
    const {
      investAmountPerMonth,
      payFor,
      returnsAfter,
      payoutType,
      planType,
      capitalGuarantee,
    } = req.query;

    const query = {};

    if (investAmountPerMonth) query.investAmountPerMonth = investAmountPerMonth;
    if (payFor) query.payFor = payFor;
    if (returnsAfter) query.returnsAfter = returnsAfter;
    if (payoutType) query.payoutType = payoutType;
    if (planType) query.planType = planType;
    if (capitalGuarantee !== undefined) query.capitalGuarantee = capitalGuarantee === "true";

    const filtered = await TermInsuranceProvider.find(query);
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put(
  "/update/:id",
  [
    check("name").optional().isString(),
    check("investAmountPerMonth").optional().isString(),
    check("payFor").optional().isString(),
    check("returnsAfter").optional().isString(),
    check("payoutType").optional().isString(),
    check("planType").optional().isString(),
    check("returnPercentage").optional().isNumeric(),
    check("projectedReturns").optional().isString(),
    check("capitalGuarantee").optional().isBoolean(),
    check("otherBenefits").optional().isArray(),
    check("fundName").optional().isString(),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const updated = await TermInsuranceProvider.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!updated) return res.status(404).json({ message: "Provider not found" });
      res.json({ message: "Updated successfully", updated });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// DELETE
router.delete("/delete/:id", async (req, res) => {
  try {
    const deleted = await TermInsuranceProvider.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Provider not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;