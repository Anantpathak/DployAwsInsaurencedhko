const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    policyNumber: { type: String, required: true },
    insuredName: { type: String, required: true },
    insuranceType: {
      type: String,
      enum: ["health", "car", "bike", "family-health", "other"],
      required: true,
    },
    paymentAmount: { type: Number, required: true },
    paymentDate: { type: Date, required: true },
    paymentMethod: {
      type: String,
      enum: ["cash", "credit", "debit", "netbanking", "upi"],
      required: true,
    },
    transactionId: { type: String, required: true, unique: true },
    document: { type: String }, // optional receipt or proof
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", paymentSchema);
