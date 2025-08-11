// routes/feedback.js
const express = require('express');
const router = express.Router();
const Feedback = require('../models/feedback');
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post('/', async (req, res) => {
  try {
    console.log("✅ Received feedback:", req.body);

    const newFeedback = new Feedback(req.body);
    await newFeedback.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, 
      subject: "📢 New Feedback Received",
      html: `
        <h2>New Feedback Submission</h2>
        <p><strong>Name:</strong> ${req.body.name || "N/A"}</p>
        <p><strong>Email/Phone:</strong> ${req.body.email || "N/A"}</p>
        <p><strong>Rating:</strong> ${req.body.rating || "N/A"}</p>
        <p><strong>Message:</strong> ${req.body.message || "N/A"}</p>
        <p><strong>Product:</strong> ${req.body.product || "N/A"}</p>
        <p><strong>Experience:</strong> ${req.body.experience || "N/A"}</p>
        <p><strong>Support Answered:</strong> ${req.body.support || "N/A"}</p>
        <p><strong>Unresolved Issues:</strong> ${req.body.unresolved || "N/A"}</p>
        <p><strong>Subscribe:</strong> ${req.body.subscribe ? "Yes" : "No"}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Feedback saved & email sent successfully' });

  } catch (error) {
    console.error("❌ Error handling feedback:", error);
    res.status(500).json({ message: 'Failed to save feedback or send email' });
  }
});

router.get('/', async (req, res) => {
  try {
    const allFeedback = await Feedback.find().sort({ _id: -1 });
    res.status(200).json(allFeedback);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch feedback' });
  }
});

module.exports = router;
