// models/product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String },
    description: { type: String },
    price: { type: Number },
    category: { type: String },
    stock: { type: Number, default: 0 },
    imageUrl: { type: String }, // Optional field for product image
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Product", productSchema);
