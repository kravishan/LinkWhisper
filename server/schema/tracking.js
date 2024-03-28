import mongoose from 'mongoose';

// Define URL schema
const trackingSchema = new mongoose.Schema({
  shortUrl: {
    type: String,
    required: true
  },
  senderEmail: {
    type: String,
    required: true
  },
  receiverEmail: {
    type: String,
    required: true
  },
  tracking: {
    type: String,
    default: 'Not Enabled'
  },

  timestamp: {
    type: Date,
    default: Date.now
  }
} , { collection: 'tracking' });

// Create model with schema
const Tracking = mongoose.model('Tracking', trackingSchema);

export { trackingSchema, Tracking };
