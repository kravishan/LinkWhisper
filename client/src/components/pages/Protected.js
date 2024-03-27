import React, { useState, useEffect } from 'react';
import { AuthData } from '../../auth/AuthWrapper';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import '../style/protected.css';
import axios from 'axios'; // Import Axios for making HTTP requests
import Cookies from '../../auth/cookieJWTAuth'; // Import the Cookies module

export const Protected = () => {
  const { user } = AuthData();
  const [shortUrl, setShortUrl] = useState('');

  // Extract the shortUrl from the URL when the component mounts
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlParam = params.get('shortUrl');
    setShortUrl(urlParam);
  }, []);

  // Function to fetch original URL from the backend and redirect
  useEffect(() => {
    const fetchOriginalUrl = async () => {
      try {
        const token = Cookies.get('token'); // Retrieve the token from cookies
        console.log(token);
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

  // If the user is not logged in, show the protected content
  if (!user.isAuthenticated) {
    return (
      <Box className="protectedContainer">
        <Paper className="protectedPaper" elevation={5}>
          <Typography variant="h4" gutterBottom className="protectedTitle">
            This is a protected link
          </Typography>
          <Typography variant="body1" gutterBottom className="protectedContent">
            Please log in to access the original link.
          </Typography>
        </Paper>
      </Box>
    );
  }

  // If the user is logged in, no need to render anything as they will be redirected
  return null;
};
