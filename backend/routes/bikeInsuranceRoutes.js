const express = require("express");
const { auth } = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const BikeInsurance = require("../models/bikeInsurance");
const { upload } = require("../utility/multer");

const router = express.Router();

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
    upload,
    auth,
    check("ownerName").not().isEmpty(),
    check("bikeModel").not().isEmpty(),
    check("registrationNumber").not().isEmpty(),
    check("insuranceProvider").not().isEmpty(),
    check("policyNumber").not().isEmpty(),
    check("coverageAmount").isFloat({ gt: 0 }),
    check("startDate").isISO8601(),
    check("endDate").isISO8601(),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const insurance = new BikeInsurance({
        ...req.body,
        document: req.file ? req.file.filename : undefined,
        userID: req.user._id,
      });

      await insurance.save();
      res.status(201).json({ message: "Bike insurance created", insurance });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// READ ALL
router.get("/all", auth, async (req, res) => {
  try {
    const records = await BikeInsurance.find().populate("userID", "name email");
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ONE
router.get("/:id", auth, async (req, res) => {
  try {
    const record = await BikeInsurance.findById(req.params.id);
    if (!record) return res.status(404).send("Not found");
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put("/:id", [auth, upload], async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) updateData.document = req.file.filename;

    const updated = await BikeInsurance.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!updated) return res.status(404).send("Not found");
    res.json({ message: "Updated", updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await BikeInsurance.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send("Not found");
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SEARCH by ownerName, registrationNumber, or policyNumber
router.get("/search/:key", auth, async (req, res) => {
  try {
    const regex = new RegExp(req.params.key, "i");
    const result = await BikeInsurance.find({
      $or: [
        { ownerName: regex },
        { registrationNumber: regex },
        { policyNumber: regex },
      ],
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
