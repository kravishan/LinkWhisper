import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { urlSchema } from './schema/links.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL;

app.use(bodyParser.json());

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Connect to MongoDB
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Create a model from the urlSchema
const URL = mongoose.model('URL', urlSchema);

// Generate shorter link and save to database
app.post('/api/shorten', async (req, res) => {
  try {
    const { Originalurl } = req.body; // Extract the URL from the request body
    const shortUrl = Math.random().toString(36).substring(7); // Generate a random string

    // Save the original and short URL to the database
    const newURL = new URL({ originalUrl: Originalurl, shortUrl });
    await newURL.save();

    // Send the response back to the frontend
    res.json({ originalUrl: Originalurl, shortUrl: shortUrl });
  } catch (error) {
    console.error('Error shortening URL:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
