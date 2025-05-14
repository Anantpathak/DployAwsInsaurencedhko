const mongoose = require("mongoose");

const investmentPlanProviderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logoUrl: { type: String },
  keyFeatures: [{ type: String }],
  baseInvestmentAmount: { type: Number, required: true },
  forYear: { type: Number, required: true },
  getReturnAmount: { type: Number, required: true },
  investmentDuration: { type: String, enum: ["Short Term", "Medium Term", "Long Term"], required: true },
});

module.exports = mongoose.model("InvestmentPlanProvider", investmentPlanProviderSchema);
