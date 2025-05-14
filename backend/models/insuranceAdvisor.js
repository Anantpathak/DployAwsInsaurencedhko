const mongoose = require("mongoose");

const insuranceAdvisorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  experience: { type: Number, required: true }, // in years
  rating: { type: Number, required: true, min: 0, max: 5 },
  city: { type: String, required: true },
  expertise: {
    type: [String],
    required: true,
    enum: ["Health Insurance", "Life Insurance", "Investment"]
  },  
  profilePic: { type: String } // Store URL or file path
});

module.exports = mongoose.model("InsuranceAdvisor", insuranceAdvisorSchema);
