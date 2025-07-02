const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  name: String,
  email: String,
  rating: Number,
  message: String,
  product: String,
  experience: String,
  support: String,
  unresolved: String,
  subscribe: Boolean
});

module.exports = mongoose.model("Feedback", feedbackSchema);
