const express = require("express");
const { check, validationResult } = require("express-validator");
const InsuranceAdvisor = require("../models/insuranceAdvisor");

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
    check("experience").isInt({ min: 0 }),
    check("rating").isFloat({ min: 0, max: 5 }),
    check("city").notEmpty(),
    check("expertise").isIn(["Health Insurance", "Life Insurance", "Investment"]),
    check("profilePic").optional().isString()
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const advisor = new InsuranceAdvisor(req.body);
      await advisor.save();
      res.status(201).json({ message: "Advisor created", advisor });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// GET ALL (with optional filters)
router.get("/all", async (req, res) => {
  try {
    const { city, expertise, minExperience, maxRating } = req.query;

    const filter = {};
    if (city) filter.city = city;
    if (expertise) {
        const expertiseArray = expertise.split(",").map(e => e.trim());
        filter.expertise = { $in: expertiseArray };
      }
      
      
    if (minExperience) filter.experience = { $gte: parseInt(minExperience) };
    if (maxRating) filter.rating = { $lte: parseFloat(maxRating) };

    const advisors = await InsuranceAdvisor.find(filter).sort({ rating: -1 });
    res.json(advisors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put(
  "/update/:id",
  [
    check("name").optional().notEmpty(),
    check("experience").optional().isInt({ min: 0 }),
    check("rating").optional().isFloat({ min: 0, max: 5 }),
    check("city").optional().notEmpty(),
    check("expertise").optional().isIn(["Health Insurance", "Life Insurance", "Investment"]),
    check("profilePic").optional().isString()
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const updated = await InsuranceAdvisor.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updated) return res.status(404).json({ message: "Advisor not found" });
      res.json({ message: "Updated successfully", advisor: updated });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// DELETE
router.delete("/delete/:id", async (req, res) => {
  try {
    const deleted = await InsuranceAdvisor.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Advisor not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
