const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortUrl: String,
  clickCount: { type: Number, default: 0 },
});

module.exports = mongoose.model('URL', urlSchema);
