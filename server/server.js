import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { urlSchema } from './schema/urlSchema.js';
import { User } from './schema/User.js';


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

// Define a route for user signup
app.post('/api/signup', async (req, res) => {
  try {
    // Extract user data from request body
    const { userName, email, password } = req.body;

    // Check if user with the provided email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Create a new user document
    const newUser = new User({ userName, email, password });
    
    // Save the new user to the database
    await newUser.save();

    // Send a success response
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a model from the urlSchema
const URL = mongoose.model('URL', urlSchema);

// Define a route for shortening URLs
app.post('/api/shorten', async (req, res) => {
  try {
    const { originalUrl, email } = req.body; // Extract the URL and email from the request body
    
    // Fetch the user from the database based on the provided email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate a short URL
    const shortUrl = generateShortUrl();

    // Save the original and short URL to the database
    const newURL = new URL({ originalUrl, shortUrl });
    await newURL.save();

    // Send the response back to the frontend
    res.json({ originalUrl, shortUrl });
  } catch (error) {
    console.error('Error shortening URL:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Redirect to original URL when shortened URL is accessed
app.get('/:shortUrl', async (req, res) => {
  try {
    const { shortUrl } = req.params;
    const urlData = await URL.findOne({ shortUrl });

    if (urlData) {
      res.redirect(urlData.originalUrl);
    } else {
      res.status(404).send('URL not found');
    }
  } catch (error) {
    console.error('Error redirecting:', error);
    res.status(500).send('Internal Server Error');
  }
});

function generateShortUrl() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = Math.floor(Math.random() * (8 - 6 + 1)) + 6; // Random length between 6 and 8
  let shortUrl = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    shortUrl += characters.charAt(randomIndex);
  }

  return shortUrl;
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
