const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const { MONGO_URI } = require("./config/config");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "./public")));
app.use(
  cors({
    origin: "*", // Allows all origins
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
const carInsuranceRoutes = require("./routes/carInsurance");
app.use("/car-insurance", carInsuranceRoutes);
const bikeInsuranceRoutes = require("./routes/bikeInsuranceRoutes");
app.use("/api/bike-insurance", bikeInsuranceRoutes);
const familyHealthRoutes = require("./routes/familyHealthInsuranceRoutes");
app.use("/api/family-health-insurance", familyHealthRoutes);

const insuranceProviderRoutes = require("./routes/carinsuranceProvider");
app.use("/api/insurance-provider", insuranceProviderRoutes);
const BikeinsuranceProviderRoutes = require("./routes/bikeProviderInsuranceRoutes");
app.use("/api/bike-insurance-provider", BikeinsuranceProviderRoutes);
const InvestmentinsuranceProviderRoutes = require("./routes/investmentInsuranceRoutes");
app.use("/api/investment-insurance-provider", InvestmentinsuranceProviderRoutes);
const NewsProviderRoutes = require("./routes/newsRoutes");
app.use("/api/news", NewsProviderRoutes);
const AdvisorRoutes = require("./routes/insuranceAdvisorRoutes");
app.use("/api/advisor", AdvisorRoutes);
const HealthProviderRoutes = require("./routes/healthInsuranceProvider");
app.use("/api/health", HealthProviderRoutes);
const TermProviderRoutes = require("./routes/termInsuranceProvider");
app.use("/api/term", TermProviderRoutes);
const InvestmentProviderRoutes = require("./routes/investmentPlanProvider");
app.use("/api/investment", InvestmentProviderRoutes);
const InvestmentUserRoutes = require("./routes/insuranceUserRoutes");
app.use("/api/userlogin", InvestmentUserRoutes);
const paymentRoutes = require('./routes/payment'); // adjust path
app.use('/api/payment', paymentRoutes);
const carOwnerRoutes = require('./routes/carPayment'); // adjust path
app.use('/api/car-owner', carOwnerRoutes);
const bikePolicyFormRoutes = require('./routes/bikePayment');
app.use('/api/bike-policy', bikePolicyFormRoutes);
const healthPolicyFormRoutes = require('./routes/healthPayment');
app.use('/api/health-policy', healthPolicyFormRoutes);

// Serve static files from React
app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
});
// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
