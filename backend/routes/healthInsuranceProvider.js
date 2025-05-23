const express = require("express");
const { check, validationResult } = require("express-validator");
const HealthInsuranceProvider = require("../models/healthInsuranceProvider");

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
    check("premiumStartingFrom").isNumeric(),
    check("claimType").notEmpty(),
    check("coverAmount").notEmpty(),
    check("insuranceFor").isIn(["Personal", "Couple", "Family", "Father", "Mother"]),
    check("areaPincode").notEmpty(),
    check("gender").isIn(["Male", "Female", "Other"]),
    check("members").optional().isArray(),
    check("members.*.relationship").isIn(["You", "Spouse", "Daughter", "Son", "Father", "Mother"]),
    check("members.*.age").isInt({ min: 0 }),
    check("members.*.count").optional().isInt({ min: 1 }),
    check("knownDiseases").optional().isArray(),
    check("knownDiseases.*").isIn(["No existing disease", "Diabetes", "BP/Hypertension", "Heart Disease", "Asthma", "Thyroid Disorder", "Other"]),
    check("otherDisease").optional().isString(),
    check("keyFeatures").optional().isArray(),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const provider = new HealthInsuranceProvider(req.body);
      await provider.save();
      res.status(201).json({ message: "Health insurance provider created", provider });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// GET ALL
router.get("/all", async (_req, res) => {
  try {
    const providers = await HealthInsuranceProvider.find();
    res.json(providers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// FILTER
router.get("/filter", async (req, res) => {
  try {
    const { insuranceFor, areaPincode, coverAmount, gender, members, knownDiseases, otherDisease } = req.query;
    const query = {};

    if (insuranceFor) query.insuranceFor = insuranceFor;
    if (areaPincode) query.areaPincode = areaPincode;
    if (coverAmount) query.coverAmount = coverAmount;
    if (gender) query.gender = gender;
    if (knownDiseases) {
      const diseases = JSON.parse(knownDiseases);
      query.knownDiseases = { $in: diseases };
    }
    if (otherDisease) {
      query.otherDisease = otherDisease;
    }
    if (members) {
      const parsedMembers = JSON.parse(members);
      query.members = {
        $elemMatch: {
          $or: parsedMembers.map(member => ({
            relationship: member.relationship,
            age: { $gte: member.age },
            count: member.count
          }))
        }
      };
    }

    const filtered = await HealthInsuranceProvider.find(query);
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
    check("claimType").optional().notEmpty(),
    check("coverAmount").optional().notEmpty(),
    check("areaPincode").optional().notEmpty(),
    check("insuranceFor").optional().isIn(["Personal", "Couple", "Family", "Father", "Mother"]),
    check("gender").optional().isIn(["Male", "Female", "Other"]),
    check("members").optional().isArray(),
    check("members.*.relationship").optional().isIn(["You", "Spouse", "Daughter", "Son", "Father", "Mother"]),
    check("members.*.age").optional().isInt({ min: 0 }),
    check("members.*.count").optional().isInt({ min: 1 }),
    check("knownDiseases").optional().isArray(),
    check("knownDiseases.*").optional().isIn(["No existing disease", "Diabetes", "BP/Hypertension", "Heart Disease", "Asthma", "Thyroid Disorder", "Other"]),
    check("otherDisease").optional().isString(),
    check("keyFeatures").optional().isArray(),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const updated = await HealthInsuranceProvider.findByIdAndUpdate(req.params.id, req.body, {
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
    const deleted = await HealthInsuranceProvider.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Provider not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;