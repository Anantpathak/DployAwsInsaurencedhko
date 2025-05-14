const mongoose = require("mongoose");

const bikeInsuranceProviderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logoUrl: { type: String },
  premiumStartingFrom: { type: Number, required: true },
  insuranceTypes: [{ type: String, enum: ["Comprehensive", "Third Party", "Own Damage"] }],
  keyFeatures: [{ type: String }],
  claimType: { type: String, required: true },
  cashlessGarages: { type: String, required: true },
  claimsSettled: { type: String, required: true },

  // Additional bike-related fields
  bikeBrandName: { type: String, required: true },
  bikeModel: { type: String, required: true },
  bikeOwnedYear: { type: Number, required: true },
  bikeRegisteredCity: { type: String, required: true },
});

module.exports = mongoose.model("BikeInsuranceProvider", bikeInsuranceProviderSchema);
