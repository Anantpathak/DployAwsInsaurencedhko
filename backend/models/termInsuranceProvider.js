const mongoose = require("mongoose");

const termInsuranceProviderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logoUrl: { type: String },
  premiumStartingFrom: { type: Number, required: true },
  keyFeatures: [{ type: String }],
  claimType: { type: String, required: true },

  lifeCoverAmount: { type: String, required: true }, // 50L, 1Cr, etc.
  ageGroup: {
    type: String,
    enum: ["<10", "<20", "<30", "<40", "<50", "<60", "<70", "<80"],
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
  tobaccoUse: { type: Boolean, required: true },
  coverageRequirement: {
    type: String,
    enum: ["50L", "1Cr", "1.5Cr", "2Cr"],
    required: true,
  },
});

module.exports = mongoose.model("TermInsuranceProvider", termInsuranceProviderSchema);
