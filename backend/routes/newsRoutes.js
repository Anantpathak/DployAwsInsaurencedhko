const express = require("express");
const { check, validationResult } = require("express-validator");
const NewsProvider = require("../models/newsProvider");

const router = express.Router();

// Middleware for validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// CREATE
router.post(
  "/create",
  [
    check("heading").notEmpty(),
    check("content").notEmpty(),
    check("writer").notEmpty(),
    check("publishedDate").isISO8601(),
    check("newsType").isIn([
      "Car Insurance",
      "Bike Insurance",
      "Health Insurance",
      "Life Insurance",
      "Term Insurance",
      "Investment News",
      "Business News",
      "Travel Insurance"
    ])
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const news = new NewsProvider(req.body);
      await news.save();
      res.status(201).json({ message: "News created", news });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// GET ALL
router.get("/all", async (_req, res) => {
  try {
    const newsList = await NewsProvider.find().sort({ publishedDate: -1 });
    res.json(newsList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// FILTER BY TYPE
router.get("/filter", async (req, res) => {
  try {
    const { type } = req.query;
    const query = type ? { newsType: type } : {};
    const filteredNews = await NewsProvider.find(query).sort({ publishedDate: -1 });
    res.json(filteredNews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put(
  "/update/:id",
  [
    check("heading").optional().notEmpty(),
    check("content").optional().notEmpty(),
    check("writer").optional().notEmpty(),
    check("publishedDate").optional().isISO8601(),
    check("newsType").optional().isIn([
      "Car Insurance",
      "Bike Insurance",
      "Health Insurance",
      "Life Insurance",
      "Term Insurance",
      "Investment News",
      "Business News",
      "Travel Insurance"
    ])
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const updatedNews = await NewsProvider.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedNews) return res.status(404).json({ message: "News not found" });
      res.json({ message: "Updated successfully", updatedNews });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// DELETE
router.delete("/delete/:id", async (req, res) => {
  try {
    const deleted = await NewsProvider.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "News not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
