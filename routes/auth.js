const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");

const router = express.Router();
const User = require("../models/user");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// === Signup ===
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists." });

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      username: name,
      email,
      password: hashedPassword,
      isGoogleUser: false,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({ user: newUser, token });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// === Login ===
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        profilePic: user.profilePic
      },
      token
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// === Google Login (Frontend) ===
router.post("/google-login", async (req, res) => {
  try {
    const { credential } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        username: name,
        email,
        password: "google_oauth",
        isGoogleUser: true,
        profilePic: picture,
      });
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        profilePic: user.profilePic
      },
      token
    });
  } catch (err) {
    console.error("Google Login Error:", err);
    res.status(500).json({ message: "Google login failed" });
  }
});

// === Google Auth Routes (for OAuth redirect flow) ===
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.redirect(`${process.env.CLIENT_URL}/google-success?token=${token}`);
  }
);

module.exports = router;
