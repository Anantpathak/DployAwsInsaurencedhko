const mongoose = require("mongoose");

const insuranceProviderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logoUrl: { type: String }, // Optional image URL
  cashlessGarages: { type: String, required: true },
  claimsSettled: { type: String, required: true },
  claimType: { type: String, required: true }, // e.g. "ZERO DEP. CLAIMS"
  premiumStartingFrom: { type: Number, required: true },
  insuranceTypes: [{ type: String, enum: ["Comprehensive", "Third Party", "Own Damage"] }],
  keyFeatures: [{ type: String }]
});

module.exports = mongoose.model("InsuranceProvider", insuranceProviderSchema);
