import mongoose from 'mongoose';

// Define URL schema with collection name
const urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortUrl: String,
  email: String,
  startDate: { type: Date, default: 0 },
  expirationDate: { type: Date, default: 0 },
  requireSignIn: Boolean,
  sharedEmails: [String],
  openCount: { type: Number, default: 0 },
}, { collection: 'shortener' }); // Specify the correct collection name here

const URL = mongoose.model('URL', urlSchema);

export { urlSchema }; // Export the schema
