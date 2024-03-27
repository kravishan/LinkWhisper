import React, { useState, useEffect } from 'react';
import { AuthData } from '../../auth/AuthWrapper';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid'; // Import Grid from Material-UI
import '../style/protected.css';
import axios from 'axios'; // Import Axios for making HTTP requests
import Cookies from '../../auth/cookieJWTAuth'; // Import the Cookies module
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

export const Protected = () => {
  const { user } = AuthData();
  const [shortUrl, setShortUrl] = useState('');
  const [email, setEmail] = useState('');

  // Extract the shortUrl from the URL when the component mounts
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlParam = params.get('shortUrl');
    setShortUrl(urlParam);
  }, []);

  // Function to handle sending email request
  const handleSendEmail = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/send-link', { email, shortUrl });
      console.log(response.data); // Assuming backend responds with success message
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  // If the user is logged in, redirect to the original URL
  useEffect(() => {
    const fetchOriginalUrl = async () => {
      try {
        const token = Cookies.get('token'); // Retrieve the token from cookies
        if (!token) {
          throw new Error('Token not found');
        }

        const response = await axios.get(`http://localhost:8000/api/original-url/${shortUrl}`, {
          headers: {
            Authorization: `Bearer ${token}` // Include the token in the request headers
          }
        }); // Adjust the URL endpoint as per your backend route
        const originalUrl = response.data.originalUrl;
        window.location.href = originalUrl; // Redirect to the original URL
      } catch (error) {
        console.error('Error fetching original URL:', error);
      }
    };

    // If the user is logged in, fetch the original URL
    if (user.isAuthenticated) {
      fetchOriginalUrl();
    }
  }, [shortUrl, user]);

  // If the user is not logged in, show the form to request the link
  if (!user.isAuthenticated) {
    return (
      <Box className="protectedContainer">
        <Paper className="protectedPaper" elevation={5}>
          <Typography variant="h4" gutterBottom className="protectedTitle" style={{ textAlign: 'center' }}>
            This is a protected link
          </Typography>

          <Typography class="email-txt" gutterBottom className="protectedContent">
            Please login or enter your email to receive the link.
          </Typography>
          <Grid container spacing={2} direction="column" alignItems="center">
            <Grid item>
            <TextField
              id="email"
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="emailField"
            />

            </Grid>
            <Grid item xs={12} md={6}>
              <Button onClick={handleSendEmail} fullWidth className="btn-send-link">
                Send Link <FontAwesomeIcon icon={faPaperPlane} className="send-icon" />
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    );
  }

  // If the user is logged in, no need to render anything as they will be redirected
  return null;
};
