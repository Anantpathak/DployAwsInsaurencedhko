// backend/config.js
require('dotenv').config();

module.exports = {
JWT_SECRET: '87sdhg90',
MONGO_URI: 'mongodb+srv://cs171009:cVLRUm4Ajt1IjpUt@cluster0.waft4vd.mongodb.net/your-db-name?retryWrites=true&w=majority',
  EMAIL_SERVICE: process.env.EMAIL_SERVICE,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS
};
