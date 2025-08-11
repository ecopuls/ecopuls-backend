// server.js
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("./config/passport");
const path = require("path");

const app = express();

// CORS setup
app.use(cors({
  origin: [
    "https://ecopuls-frontend.onrender.com",
    "https://eco-puls.com"
  ],
  credentials: true
}));

// Middleware
app.use(bodyParser.json());
app.use(express.json());

// Express session
app.use(session({
  secret: process.env.SESSION_SECRET || "defaultSecret",
  resave: false,
  saveUninitialized: true,
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Static files (optional)
app.use("/static", express.static(path.join(__dirname, "public")));

// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/feedback", require("./routes/feedback"));
app.use("/api/custom-products", require("./routes/customProduct"));

// Optional: Serve frontend build
// app.use(express.static(path.join(__dirname, "../frontend")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend", "index.html"));
// });

// MongoDB Connect & Start Server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message);
  });
