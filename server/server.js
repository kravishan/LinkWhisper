import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { urlSchema } from './schema/urlSchema.js';
import { User } from './schema/User.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL;
const isLogged = false;

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


app.post('/api/login', async (req, res) => {
  try {
    // Extract email and password from request body
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // If user not found, send error response
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare password with user's password stored in the database
    if (password !== user.password) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // Passwords match, set isLogged session variable
    isLogged = true;

    // Passwords match, send success response
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
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

// Generate shorter link with start and expiration dates and save to database
app.post('/api/shorten', async (req, res) => {
  try {
    const { originalUrl, email, startDate, expirationDate, requireSignIn, sharedEmails } = req.body; // Extract URL, email, start date, and expiration date from the request body
    const shortUrl = generateShortUrl(); // Generate a short URL

    // Save the original URL, email, short URL, start date, and expiration date to the database
    const newURL = new URL({ originalUrl, email, shortUrl, startDate, expirationDate, requireSignIn, sharedEmails });
    await newURL.save();

    // Send the response back to the frontend
    res.json({ originalUrl, shortUrl });
  } catch (error) {
    console.error('Error shortening URL:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/:shortUrl', async (req, res) => {
  try {
    const { shortUrl } = req.params;
    const urlData = await URL.findOne({ shortUrl });

    if (urlData) {
      const currentDate = new Date();
      const startDate = urlData.startDate ? new Date(urlData.startDate) : null;
      const expirationDate = urlData.expirationDate ? new Date(urlData.expirationDate) : null;
      const requireSignIn = urlData.requireSignIn || false;

      if (isLogged === false && requireSignIn === true) {
        // User is required to sign in but is not logged in
        return res.status(401).send('Please login to access this URL');
      }

      if (startDate === null && expirationDate === null) {
        // No start date and no expiration date, URL is accessible
        res.redirect(urlData.originalUrl);
      } else if (startDate !== null && startDate > currentDate) {
        // Start date is in the future, URL is not yet available
        res.status(400).send('Shortened URL is not available yet');
      } else if (expirationDate !== null && expirationDate < currentDate) {
        // Expiration date is in the past, URL has expired
        res.status(400).send('Shortened URL has expired');
      } else {
        // URL is accessible
        res.redirect(urlData.originalUrl);
      }
    } else {
      res.status(404).send('URL not found');
    }
  } catch (error) {
    console.error('Error redirecting:', error);
    res.status(500).send('Internal Server Error');
  }
});


// Define an endpoint to fetch user data from the database
app.get('/api/userData/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const userData = await URL.find({ email }); // Assuming URL is your Mongoose model
    res.json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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
