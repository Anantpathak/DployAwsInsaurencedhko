// routes/product.js
const express = require("express");
const { auth } = require("../middleware/auth");
// const Product = require(?"../models/product");
const Product = require("../models/product");
const { check, validationResult } = require("express-validator");
const path = require("path");
const { upload } = require("../utility/multer");

const router = express.Router();

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Create Product
router.post(
  "/create",
  [
    upload,
    auth, // Ensure the user is authenticated
    check("name").not().isEmpty().withMessage("Product name is required"),
    check("description")
      .not()
      .isEmpty()
      .withMessage("Product description is required"),
    check("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be a positive number"),
    check("category").not().isEmpty().withMessage("Category is required"),
    check("stock")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Stock must be a non-negative integer"),
  ],
  handleValidationErrors,
  async (req, res) => {
    const { name, description, price, category, stock, imageUrl } = req.body;
    const user = req.user;

    console.log(req.file, req.body);

    // Check if the user is a staff member
    // if (user.userType !== "staff") {
    //   return res.status(403).send("Access forbidden: Staff only");
    // }

    if (!req.file) {
      return res.status(400).send("Image file is required");
    }

    try {
      const newProduct = new Product({
        name,
        description,
        price,
        category,
        stock,
        imageUrl: req.file.filename,
      });
      await newProduct.save();
      res.json({ message: "successfll", newProduct }).status(201);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
);

//Get the pagination
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const perPage = 10;
    const totalProduct = await Product.countDocuments();
    const totalPage = Math.ceil(totalProduct / perPage);
    if (page > totalPage) {
      return res.status(404).json({ message: "Page not found" });
    }
    const Products = await Product.find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();
    res.json({ Products, totalPage, page }).status(200).cookie("lofer", "Yes");
  } catch (error) {
    res.status(500).json({ err: error });
  }
});

// Get All Products
router.get("/all", async (req, res) => {
  try {
    const products = await Product.find();
    // Map products to include full image URL
    const productsWithImageUrls = products.map((product) => ({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      imageUrl: `http://localhost:3000/static/${product.imageUrl}`, // Construct the full image URL
    }));

    // Send the list of products with image URLs
    res.json(productsWithImageUrls);
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

// Get Single Product by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).send("Product not found");
    res.json(product);
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

// Update Product by ID
router.put(
  "/:id",
  [
    auth, // Ensure the user is authenticated
    check("name")
      .optional()
      .not()
      .isEmpty()
      .withMessage("Product name is required"),
    check("description")
      .optional()
      .not()
      .isEmpty()
      .withMessage("Product description is required"),
    check("price")
      .optional()
      .isFloat({ gt: 0 })
      .withMessage("Price must be a positive number"),
    check("category")
      .optional()
      .not()
      .isEmpty()
      .withMessage("Category is required"),
    check("stock")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Stock must be a non-negative integer"),
  ],
  handleValidationErrors,
  async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category, stock, imageUrl } = req.body;

    try {
      const product = await Product.findByIdAndUpdate(
        id,
        { name, description, price, category, stock, imageUrl },
        { new: true, runValidators: true }
      );
      if (!product) return res.status(404).send("Product not found");
      res.json({ message: "Product updated successfully", product });
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
);

// Delete Product by ID
router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).send("Product not found");
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
