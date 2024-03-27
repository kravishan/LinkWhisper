import React, { useState, useEffect } from 'react';
import { AuthData } from '../../auth/AuthWrapper';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
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
  const [failureMessage, setFailureMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlParam = params.get('shortUrl');
    setShortUrl(urlParam);
  }, []);

  const handleSendEmail = async () => {
    try {
      await sendEmail(email, shortUrl);
      setSuccessMessage("Email sent successfully");
      setFailureMessage(""); // Reset failure message
      setOpenSnackbar(true);
      setTimeout(() => {
        setOpenSnackbar(false);
        navigate("/");
      }, 6000);
    } catch (error) {
      setFailureMessage("Failed to send email");
      setSuccessMessage(""); // Reset success message
      setOpenSnackbar(true);
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
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <MuiAlert onClose={handleCloseSnackbar} severity={successMessage ? "success" : "error"} sx={{ width: '100%' }}>
          {successMessage || failureMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};
