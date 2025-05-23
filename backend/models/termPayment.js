const mongoose = require("mongoose");

const termPaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  termInsuranceId: { type: mongoose.Schema.Types.ObjectId, ref: "TermInsuranceProvider", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  address: { type: String, required: true },
  dob: { type: Date, required: true },
  pan: { type: String, required: true },
  annualIncome: { type: Number, required: true },
  nomineeName: { type: String, required: true },
  nomineeRelationship: { type: String, required: true },
  tobaccoUseConfirmed: { type: Boolean, default: false },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TermPayment", termPaymentSchema);