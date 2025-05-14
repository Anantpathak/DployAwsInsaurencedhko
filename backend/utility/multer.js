const multer = require("multer");
const path = require("path");

// Define storage location for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/static")); // Ensure the directory exists
  },
  filename: (req, file, cb) => {
    // Ensure the file is saved with a unique name
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

// Configure multer with file size limit (5MB)
const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit
}).single("imageUrl"); // Ensure field name is "imageUrl" in the form or request

module.exports = { upload };
