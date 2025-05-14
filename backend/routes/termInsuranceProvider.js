const express = require("express");
const { check, validationResult } = require("express-validator");
const TermInsuranceProvider = require("../models/termInsuranceProvider");

const router = express.Router();

// Middleware
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
    check("premiumStartingFrom").isNumeric(),
    check("claimType").notEmpty(),
    check("lifeCoverAmount").notEmpty(),
    check("ageGroup").isIn(["<10", "<20", "<30", "<40", "<50", "<60", "<70", "<80"]),
    check("gender").isIn(["male", "female", "other"]),
    check("tobaccoUse").isBoolean(),
    check("coverageRequirement").isIn(["50L", "1Cr", "1.5Cr", "2Cr"]),
    check("keyFeatures").optional().isArray(),
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
    const { lifeCoverAmount, gender, tobaccoUse, ageGroup, coverageRequirement } = req.query;
    const query = {};

    if (lifeCoverAmount) query.lifeCoverAmount = lifeCoverAmount;
    if (gender) query.gender = gender;
    if (tobaccoUse) query.tobaccoUse = tobaccoUse === "true"; // convert string to boolean
    if (ageGroup) query.ageGroup = ageGroup;
    if (coverageRequirement) query.coverageRequirement = coverageRequirement;

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
    check("name").optional().notEmpty(),
    check("premiumStartingFrom").optional().isNumeric(),
    check("keyFeatures").optional().isArray(),
    check("claimType").optional().notEmpty(),
    check("lifeCoverAmount").optional().notEmpty(),
    check("ageGroup").optional().isIn(["<10", "<20", "<30", "<40", "<50", "<60", "<70", "<80"]),
    check("gender").optional().isIn(["male", "female", "other"]),
    check("tobaccoUse").optional().isBoolean(),
    check("coverageRequirement").optional().isIn(["50L", "1Cr", "1.5Cr", "2Cr"]),
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
