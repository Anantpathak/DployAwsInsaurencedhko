const mongoose = require("mongoose");

const newsProviderSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  content: { type: String, required: true },
  writer: { type: String, required: true },
  publishedDate: { type: Date, required: true },
  newsType: {
    type: String,
    required: true,
    enum: [
      "Car Insurance",
      "Bike Insurance",
      "Health Insurance",
      "Life Insurance",
      "Term Insurance",
      "Investment News",
      "Business News",
      "Travel Insurance"
    ]
  }
});

module.exports = mongoose.model("NewsProvider", newsProviderSchema);
