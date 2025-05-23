const mongoose = require('mongoose');

const healthPolicyFormSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  healthPolicyId: {
    type: String,
    required: true,
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  address: { type: String, required: true },
  pan: { type: String, required: true },
  dob: { type: String, required: true },
  policyFor: { type: String, required: true },
  relation: { type: String, required: true },
  nomineeName: { type: String, required: true },
  nomineeRelation: { type: String, required: true },
  medicalHistory: { type: String },
  amount: { type: Number, required: true },
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
  otherDisease: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('HealthPayment', healthPolicyFormSchema);