import React, { useState, useEffect } from 'react';
import { AuthData } from '../../auth/AuthWrapper';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar'; // Import Snackbar component
import MuiAlert from '@mui/material/Alert'; // Import Alert component for Snackbar
import '../style/protected.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from '../../auth/cookieJWTAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import sendEmail from '../../services/sendEmail';

export const Protected = () => {
  const { user } = AuthData();
  const [shortUrl, setShortUrl] = useState('');
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false); // State for snackbar

  const navigate = useNavigate(); // useNavigate hook

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlParam = params.get('shortUrl');
    setShortUrl(urlParam);
  }, []);

  const handleSendEmail = async () => {
    try {
      await sendEmail(email, shortUrl);
      setSuccessMessage("Email sent successfully");
      setOpenSnackbar(true); // Open the snackbar
      setTimeout(() => {
        setOpenSnackbar(false); // Close the snackbar
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  useEffect(() => {
    const fetchOriginalUrl = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          throw new Error('Token not found');
        }

        const response = await axios.get(`http://localhost:8000/api/original-url/${shortUrl}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const originalUrl = response.data.originalUrl;
        window.location.href = originalUrl;
      } catch (error) {
        // Handle error
      }
    };

    if (!user.isAuthenticated) {
      fetchOriginalUrl();
    }
  }, [shortUrl, user]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box className="protectedContainer">
      <Paper className="protectedPaper" elevation={5}>
        <Typography variant="h4" gutterBottom className="protectedTitle" style={{ textAlign: 'center' }}>
          This is a protected link
        </Typography>

        <Typography class="email-txt" gutterBottom className="protectedContent">
          Please enter your email to receive the link.
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
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} // Bottom left corner
      >
        <MuiAlert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};
