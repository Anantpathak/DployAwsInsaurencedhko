const mongoose = require("mongoose");

const familyHealthInsuranceSchema = new mongoose.Schema(
  {
    insuredFamilyName: { type: String, required: true },
    familyMembers: [{ name: String, age: Number, relation: String }], // Array of members
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

module.exports = mongoose.model("FamilyHealthInsurance", familyHealthInsuranceSchema);
