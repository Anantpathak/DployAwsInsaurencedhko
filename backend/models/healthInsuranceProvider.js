const mongoose = require("mongoose");

const healthInsuranceProviderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logoUrl: { type: String },
  premiumStartingFrom: { type: Number, required: true },
  keyFeatures: [{ type: String }],
  claimType: { type: String, required: true },
  coverAmount: { type: String, required: true },
  areaPincode: { type: String, required: true },

  insuranceFor: {
    type: String,
    enum: ["Personal", "Couple", "Family", "Father", "Mother"],
    required: true,
  },


});

module.exports = mongoose.model("HealthInsuranceProvider", healthInsuranceProviderSchema);
