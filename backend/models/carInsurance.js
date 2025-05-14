const mongoose = require("mongoose");

const carInsuranceSchema = new mongoose.Schema(
  {
    ownerName: { type: String, required: true },
    carModel: { type: String, required: true },
    registrationNumber: { type: String, required: true, unique: true },
    insuranceProvider: { type: String, required: true },
    policyNumber: { type: String, required: true, unique: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    premiumAmount: { type: Number, required: true },
    status: { type: String, enum: ["active", "expired"], default: "active" },
    document: { type: String }, // filename of uploaded PDF or image
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CarInsurance", carInsuranceSchema);
