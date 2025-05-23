const express = require("express");
const { check, validationResult } = require("express-validator");
const InsuranceProvider = require("../models/carinsuranceProvider");

const router = express.Router();

// Middleware to validate and return errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// POST /api/insurance-provider/create
router.post(
  "/create",
  [
    check("name").notEmpty().withMessage("Name is required"),
    check("cashlessGarages").notEmpty().withMessage("Cashless Garages is required"),
    check("claimsSettled").notEmpty().withMessage("Claims Settled is required"),
    check("claimType").notEmpty().withMessage("Claim Type is required"),
    check("premiumStartingFrom").isNumeric().withMessage("Premium amount must be a number"),
    check("insuranceTypes").isArray().withMessage("Insurance types must be an array"),
    check("keyFeatures").optional().isArray(),
    check("carBrand").notEmpty().withMessage("Car brand is required"),
    check("carBrandModel").notEmpty().withMessage("Car brand model is required"),
    check("typeOfCar").isIn(["Petrol", "Diesel", "CNG"]).withMessage("Type of car must be Petrol, Diesel, or CNG"),
    check("cityCarRegistered").notEmpty().withMessage("City of car registration is required"),
    check("carBuyedYear")
      .isInt({ min: 1900, max: new Date().getFullYear() })
      .withMessage(`Car buyed year must be between 1900 and ${new Date().getFullYear()}`)
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const insuranceProvider = new InsuranceProvider(req.body);
      await insuranceProvider.save();
      res.status(201).json({ message: "Insurance provider created", insuranceProvider });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// GET /api/insurance-provider/all
router.get("/all", async (req, res) => {
  try {
    const providers = await InsuranceProvider.find();
    res.json(providers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/insurance-provider/filter?type=Comprehensive
router.get('/filter', async (req, res) => {
  try {
    const { type } = req.query;

    if (!type) {
      return res.status(400).json({ error: 'Insurance type is required' });
    }

    // Correct query: check if insuranceTypes array contains the type
    const providers = await InsuranceProvider.find({ insuranceTypes: type });

    res.json(providers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/insurance-provider/car-details
router.get(
  "/car-details",
  [
    check("carBrand").optional().notEmpty().withMessage("Car brand cannot be empty"),
    check("carBrandModel").optional().notEmpty().withMessage("Car brand model cannot be empty"),
    check("typeOfCar").optional().isIn(["Petrol", "Diesel", "CNG"]).withMessage("Type of car must be Petrol, Diesel, or CNG"),
    check("cityCarRegistered").optional().notEmpty().withMessage("City of car registration cannot be empty"),
    check("carBuyedYear")
      .optional()
      .isInt({ min: 1900, max: new Date().getFullYear() })
      .withMessage(`Car buyed year must be between 1900 and ${new Date().getFullYear()}`)
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { carBrand, carBrandModel, typeOfCar, cityCarRegistered, carBuyedYear } = req.query;

      // Build query object dynamically based on provided parameters
      const query = {};
      if (carBrand) query.carBrand = carBrand;
      if (carBrandModel) query.carBrandModel = carBrandModel;
      if (typeOfCar) query.typeOfCar = typeOfCar;
      if (cityCarRegistered) query.cityCarRegistered = cityCarRegistered;
      if (carBuyedYear) query.carBuyedYear = carBuyedYear;

      if (Object.keys(query).length === 0) {
        return res.status(400).json({ error: "At least one filter parameter is required" });
      }

      const providers = await InsuranceProvider.find(query);
      res.json(providers);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// PUT /api/insurance-provider/update/:id
router.put(
  "/update/:id",
  [
    check("name").optional().notEmpty().withMessage("Name cannot be empty"),
    check("cashlessGarages").optional().notEmpty().withMessage("Cashless Garages cannot be empty"),
    check("claimsSettled").optional().notEmpty().withMessage("Claims Settled cannot be empty"),
    check("claimType").optional().notEmpty().withMessage("Claim Type cannot be empty"),
    check("premiumStartingFrom").optional().isNumeric().withMessage("Premium amount must be a number"),
    check("insuranceTypes").optional().isArray().withMessage("Insurance types must be an array"),
    check("keyFeatures").optional().isArray().withMessage("Key features must be an array"),
    check("carBrand").optional().notEmpty().withMessage("Car brand cannot be empty"),
    check("carBrandModel").optional().notEmpty().withMessage("Car brand model cannot be empty"),
    check("typeOfCar").optional().isIn(["Petrol", "Diesel", "CNG"]).withMessage("Type of car must be Petrol, Diesel, or CNG"),
    check("cityCarRegistered").optional().notEmpty().withMessage("City of car registration cannot be empty"),
    check("carBuyedYear")
      .optional()
      .isInt({ min: 1900, max: new Date().getFullYear() })
      .withMessage(`Car buyed year must be between 1900 and ${new Date().getFullYear()}`)
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const updatedProvider = await InsuranceProvider.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!updatedProvider) {
        return res.status(404).json({ error: "Insurance provider not found" });
      }

      res.json({ message: "Insurance provider updated", updatedProvider });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// DELETE /api/insurance-provider/delete/:id
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProvider = await InsuranceProvider.findByIdAndDelete(id);

    if (!deletedProvider) {
      return res.status(404).json({ error: "Insurance provider not found" });
    }

    res.json({ message: "Insurance provider deleted", deletedProvider });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// GET /api/insurance-provider/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const provider = await InsuranceProvider.findById(id);

    if (!provider) {
      return res.status(404).json({ error: "Insurance provider not found" });
    }

    res.json(provider);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;