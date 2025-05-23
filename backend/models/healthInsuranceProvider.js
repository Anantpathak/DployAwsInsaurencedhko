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
  gender: { 
    type: String, 
    enum: ["Male", "Female", "Other"], 
    required: true 
  },
  members: [{
    relationship: { 
      type: String, 
      enum: ["You", "Spouse", "Daughter", "Son", "Father", "Mother"], 
      required: true 
    },
    age: { type: Number, required: true },
    count: { type: Number, default: 1 }
  }],
  knownDiseases: [{ 
    type: String, 
    enum: ["No existing disease", "Diabetes", "BP/Hypertension", "Heart Disease", "Asthma", "Thyroid Disorder", "Other"]
  }],
  otherDisease: { type: String } // If "Other" is selected in knownDiseases
});

module.exports = mongoose.model("HealthInsuranceProvider", healthInsuranceProviderSchema);
