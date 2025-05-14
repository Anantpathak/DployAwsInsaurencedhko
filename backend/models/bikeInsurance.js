const mongoose = require("mongoose");

const bikeInsuranceSchema = new mongoose.Schema(
  {
    ownerName: { type: String, required: true },
    bikeModel: { type: String, required: true },
    registrationNumber: { type: String, required: true, unique: true },
    insuranceProvider: { type: String, required: true },
    policyNumber: { type: String, required: true, unique: true },
    coverageAmount: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ["active", "expired"], default: "active" },
    document: { type: String },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("BikeInsurance", bikeInsuranceSchema);
