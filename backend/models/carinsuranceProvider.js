const mongoose = require("mongoose");

const insuranceProviderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logoUrl: { type: String }, // Optional image URL
  cashlessGarages: { type: String, required: true },
  claimsSettled: { type: String, required: true },
  claimType: { type: String, required: true }, // e.g. "ZERO DEP. CLAIMS"
  premiumStartingFrom: { type: Number, required: true },
  insuranceTypes: [{ type: String, enum: ["Comprehensive", "Third Party", "Own Damage"] }],
  keyFeatures: [{ type: String }],
  carBrand: { type: String, required: true }, // e.g., "Toyota", "Honda"
  carBrandModel: { type: String, required: true }, // e.g., "Corolla", "Civic"
  typeOfCar: { type: String, required: true, enum: ["Petrol", "Diesel", "CNG"] }, // Car fuel type
  cityCarRegistered: { type: String, required: true }, // City where car is registered
  carBuyedYear: { type: Number, required: true, min: 1900, max: new Date().getFullYear() } // Year car was bought
});

module.exports = mongoose.model("InsuranceProvider", insuranceProviderSchema);