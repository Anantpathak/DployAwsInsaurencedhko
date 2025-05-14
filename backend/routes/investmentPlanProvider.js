const express = require("express");
const { check, validationResult } = require("express-validator");
const InvestmentPlanProvider = require("../models/investmentPlanProvider");

const router = express.Router();

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// CREATE
router.post(
  "/create",
  [
    check("name").notEmpty(),
    check("baseInvestmentAmount").isNumeric(),
    check("forYear").isNumeric(),
    check("getReturnAmount").isNumeric(),
    check("investmentDuration").isIn(["Short Term", "Medium Term", "Long Term"]),
    check("keyFeatures").optional().isArray(),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const plan = new InvestmentPlanProvider(req.body);
      await plan.save();
      res.status(201).json({ message: "Investment plan created", plan });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// GET ALL
router.get("/all", async (_req, res) => {
  try {
    const plans = await InvestmentPlanProvider.find();
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// FILTER
router.get("/filter", async (req, res) => {
  try {
    const { duration, minAmount, maxAmount } = req.query;
    const query = {};

    if (duration) query.investmentDuration = duration;
    if (minAmount || maxAmount) {
      query.baseInvestmentAmount = {};
      if (minAmount) query.baseInvestmentAmount.$gte = +minAmount;
      if (maxAmount) query.baseInvestmentAmount.$lte = +maxAmount;
    }

    const filtered = await InvestmentPlanProvider.find(query);
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put(
  "/update/:id",
  [
    check("name").optional().notEmpty(),
    check("baseInvestmentAmount").optional().isNumeric(),
    check("forYear").optional().isNumeric(),
    check("getReturnAmount").optional().isNumeric(),
    check("investmentDuration").optional().isIn(["Short Term", "Medium Term", "Long Term"]),
    check("keyFeatures").optional().isArray(),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const updated = await InvestmentPlanProvider.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!updated) return res.status(404).json({ message: "Plan not found" });
      res.json({ message: "Updated successfully", updated });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// DELETE
router.delete("/delete/:id", async (req, res) => {
  try {
    const deleted = await InvestmentPlanProvider.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Plan not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
