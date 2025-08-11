const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const CustomProduct = require("../models/CustomProduct");

// 📌 POST - Add a new custom product
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, productType, description } = req.body;

    if (!name || !email || !phone || !productType || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newProduct = new CustomProduct({
      name,
      email,
      phone,
      productType,
      description,
    });

    await newProduct.save();

    // 📧 Send Email Notification
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      replyTo: email, // When you click reply, it goes to the user's email
      to: process.env.EMAIL_USER,
      subject: "New Custom Product Request",
      html: `
    <h2>New Custom Product Request</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Product Type:</strong> ${productType}</p>
    <p><strong>Description:</strong> ${description}</p>
  `,
    };


    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Custom product submitted successfully" });
  } catch (error) {
    console.error("Error in /api/custom-product:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 📌 GET - Fetch all custom products
router.get("/", async (req, res) => {
  try {
    const products = await CustomProduct.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error("Error fetching custom products:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
