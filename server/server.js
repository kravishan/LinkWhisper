import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { urlSchema } from './schema/urlSchema.js';
import { User } from './schema/User.js';
import sgMail from '@sendgrid/mail';
import SibApiV3Sdk from 'sib-api-v3-sdk';
import generateEmailContent  from './models/template.js';


dotenv.config();

var defaultClient = SibApiV3Sdk.ApiClient.instance;
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const app = express();
app.use(cors());
const PORT = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL;

app.use(bodyParser.json());

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
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


// Passport Local Strategy for authentication
passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return done(null, false, { message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return done(null, false, { message: 'Incorrect password' });
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});


function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, userEmail) => {
    if (err) return res.sendStatus(403);
    req.userEmail = userEmail;
    next();
  })
}

// Login endpoint using Passport
app.post('/api/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (!user) {
      // User not found or incorrect email/password
      return res.status(400).json({ error: info.message });
    }

    const userEmail = user.email;

    const accessToken = jwt.sign({ email: userEmail }, process.env.JWT_SECRET);

    // console.log('Token:', accessToken);


    // Send success message
    return res.status(200).json({ accessToken: accessToken });
  })(req, res, next);
});


// Logout endpoint
app.post('/api/logout', (req, res) => {
  // Clear isLogged from the session upon logout
  req.logout(); // Optional: If you are using passport, you can also call req.logout() to remove the user from the session
  // Send success message
  res.status(200).json({ message: 'Logout successful' });
});

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const newUser = new User({ userName, email, password: hashedPassword }); // Save the hashed password
    await newUser.save();

    // Send success message
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    // Send internal server error message
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
      // Increment the openCount
      urlData.openCount++;
      await urlData.save(); // Save the updated document with incremented openCount

      const currentDate = new Date();
      const startDate = urlData.startDate ? new Date(urlData.startDate) : null;
      const expirationDate = urlData.expirationDate ? new Date(urlData.expirationDate) : null;
      const requireSignIn = urlData.requireSignIn || false;

      if (requireSignIn === true) {
        return res.redirect(`http://localhost:3000/protected?shortUrl=${shortUrl}`);
      }

      if (startDate === null && expirationDate === null) {
        // No start date and no expiration date, URL is accessible
        res.redirect(urlData.originalUrl);
      } else if (startDate !== null && startDate > currentDate) {
        // Start date is in the future, URL is not yet available
        res.status(400).send('Shortened URL is not available yet');
      } else if (expirationDate !== null && expirationDate <= currentDate) {
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


// Define a route to handle fetching the original URL
app.get('/api/original-url/:shortUrl', authenticateToken, async (req, res) => {
  try {
    const shortUrlParam = req.params.shortUrl;

    // Query the database for a record with the provided shortUrl
    const urlData = await URL.findOne({ shortUrl: shortUrlParam });

    if (urlData) {
      // If a record is found, send back the original URL to the client
      res.json({ originalUrl: urlData.originalUrl });
    } else {
      // If no record is found, send back an error message
      res.status(404).json({ error: 'Shortened URL not found' });
    }
  } catch (error) {
    console.error('Error fetching original URL:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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


app.post('/api/send-email', async (req, res) => {
  try {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const { email, shortUrl } = req.body; // Extract user's email and shortUrl from request body

    // Query the database for a record with the provided shortUrl
    const urlData = await URL.findOne({ shortUrl: shortUrl });

    if (!urlData) {
      throw new Error('Original URL not found');
    }

    const originalUrl = urlData.originalUrl;

    const sender = { 
      email: 'testing@gmail.com',
      name: 'Testing'
    };

    const receivers = [
      {
        email: email, // Use the email provided by the user
      }
    ];

    const htmlContent = generateEmailContent(originalUrl); // Generate HTML email content using the template function

    const sendEmail = await apiInstance.sendTransacEmail({
      sender,
      to: receivers,
      subject: 'Test Email',
      htmlContent: htmlContent, // Use the generated HTML content for the email
    });
    
    return res.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    // Send error response
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
