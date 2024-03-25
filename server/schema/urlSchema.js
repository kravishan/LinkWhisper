import mongoose from 'mongoose';

// Define URL schema with collection name
const urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortUrl: String,
  email: String,
  clickCount: { type: Number, default: 0 },
}, { collection: 'shortener' }); // Specify the correct collection name here

const URL = mongoose.model('URL', urlSchema);

export { urlSchema }; // Export the schema
