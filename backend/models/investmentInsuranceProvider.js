const mongoose = require("mongoose");

const termInsuranceProviderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logoUrl: { type: String },
  capitalGuarantee: { type: Boolean, default: false },

  // Financial Details
  investAmountPerMonth: { type: String, required: true }, // e.g., "2.5k/month"
  payFor: { type: String, required: true },               // e.g., "10 Years"
  returnsAfter: { type: String, required: true },         // e.g., "20 Years"
  payoutType: { type: String, required: true },           // e.g., "Lump Sum"
  planType: { type: String, required: true },             // e.g., "Market Linked"
  returnPercentage: { type: Number, required: true },     // e.g., 26.56
  projectedReturns: { type: String, required: true },     // e.g., "₹1.43 Cr"

  // Other Info
  fundName: { type: String },
  otherBenefits: [{ type: String }],                      // e.g., ["Life Cover - 3 Lakh", "Tax Saving - ₹18.3 Lakh"]
});

module.exports = mongoose.model("Term", termInsuranceProviderSchema);
