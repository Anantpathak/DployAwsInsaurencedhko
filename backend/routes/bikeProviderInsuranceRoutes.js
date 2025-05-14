const express = require("express");
const { check, validationResult } = require("express-validator");
const BikeInsuranceProvider = require("../models/bikeInsuranceProvider");

const router = express.Router();

// Middleware to handle validation errors
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
    check("cashlessGarages").notEmpty(),
    check("claimsSettled").notEmpty(),
    check("claimType").notEmpty(),
    check("premiumStartingFrom").isNumeric(),
    check("insuranceTypes").isArray(),
    check("bikeBrandName").notEmpty(),
    check("bikeModel").notEmpty(),
    check("bikeOwnedYear").isNumeric(),
    check("bikeRegisteredCity").notEmpty(),
    check("keyFeatures").optional().isArray(),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const provider = new BikeInsuranceProvider(req.body);
      await provider.save();
      res.status(201).json({ message: "Bike insurance provider created", provider });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// GET ALL
router.get("/all", async (_req, res) => {
  try {
    const providers = await BikeInsuranceProvider.find();
    res.json(providers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// FILTER
router.get("/filter", async (req, res) => {
  try {
    const { type, brand, model, year, city } = req.query;
    const query = {};

    if (type) query.insuranceTypes = type;
    if (brand) query.bikeBrandName = brand;
    if (model) query.bikeModel = model;
    if (year) query.bikeOwnedYear = +year;
    if (city) query.bikeRegisteredCity = city;

    const filtered = await BikeInsuranceProvider.find(query);
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
    check("insuranceTypes").optional().isArray(),
    check("bikeOwnedYear").optional().isNumeric(),
    check("keyFeatures").optional().isArray(),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const updated = await BikeInsuranceProvider.findByIdAndUpdate(req.params.id, req.body, {
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
    const deleted = await BikeInsuranceProvider.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Provider not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
