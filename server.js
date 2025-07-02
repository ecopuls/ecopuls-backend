const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

// Load env variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Serve static files
app.use(express.static('backend/public'));

// Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const feedbackRoute = require("./routes/feedback");
app.use("/api/feedback", feedbackRoute);

const customProductRoute = require("./routes/customProduct");
app.use("/api/custom-product", customProductRoute);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection failed:", err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
