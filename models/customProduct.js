const mongoose = require('mongoose');

const customProductSchema = new mongoose.Schema({
  name: String,
  contact: String,
  size: String,
  quantity: String,
  details: String,
});

module.exports = mongoose.model("CustomProduct", customProductSchema);
