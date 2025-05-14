const express = require("express");
const { auth } = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const CarInsurance = require("../models/carInsurance");
const { upload } = require("../utility/multer");

const router = express.Router();

// Middleware to handle validation errors
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

// Create Car Insurance Record
router.post(
  "/create",
  [
    upload, // Middleware to handle file upload
 // Ensure the user is authenticated
    check("ownerName").not().isEmpty().withMessage("Owner name is required"),
    check("carModel").not().isEmpty().withMessage("Car model is required"),
    check("registrationNumber").not().isEmpty().withMessage("Registration number is required"),
    check("insuranceProvider").not().isEmpty().withMessage("Insurance provider is required"),
    check("policyNumber").not().isEmpty().withMessage("Policy number is required"),
    check("startDate").isISO8601().withMessage("Start date must be a valid date"),
    check("endDate").isISO8601().withMessage("End date must be a valid date"),
    check("premiumAmount").isFloat({ gt: 0 }).withMessage("Premium amount must be greater than 0"),
  ],
  handleValidationErrors, // Custom validation middleware to handle errors
  async (req, res) => {
    if (req.file && req.file.size > 5000000) {
      return res.status(400).json({ error: "File size exceeds the limit of 5MB" });
    }

    const {
      ownerName,
      carModel,
      registrationNumber,
      insuranceProvider,
      policyNumber,
      startDate,
      endDate,
      premiumAmount,
    } = req.body;

    try {
      const insurance = new CarInsurance({
        ownerName,
        carModel,
        registrationNumber,
        insuranceProvider,
        policyNumber,
        startDate,
        endDate,
        premiumAmount,
        document: req.file ? req.file.filename : undefined,
        userID: '6806f9f9ffa6e480181c10c9',
      });

      await insurance.save();
      res.status(201).json({ message: "Car insurance created successfully", insurance });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Get All Car Insurance Records
router.get("/all", async (req, res) => {
  try {
    const records = await CarInsurance.find().populate("userID", "name email");
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Car Insurance Record by ID
router.get("/:id", async (req, res) => {
  try {
    const record = await CarInsurance.findById(req.params.id);
    if (!record) return res.status(404).send("Car insurance record not found");
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Car Insurance Record
router.put(
  "/:id",
  [auth, upload], // Ensure the user is authenticated and file is handled
  async (req, res) => {
    try {
      const updateData = { ...req.body };
      if (req.file) updateData.document = req.file.filename;

      const updated = await CarInsurance.findByIdAndUpdate(req.params.id, updateData, { new: true });
      if (!updated) return res.status(404).send("Car insurance record not found");
      res.json({ message: "Car insurance updated successfully", updated });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Delete Car Insurance Record
router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await CarInsurance.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send("Car insurance record not found");
    res.json({ message: "Car insurance record deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
