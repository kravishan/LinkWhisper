import React, { useState } from 'react';
import { AuthData } from '../../auth/AuthWrapper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import '../style/protected.css'; 

export const Protected = () => {
  const { user } = AuthData();

  const [showLink, setShowLink] = useState(false);

  const handleButtonClick = () => {
    setShowLink(!showLink);
  };

  return (
    <Box className="protectedContainer">
      <Paper className="protectedPaper" elevation={5}>
        <Typography variant="h4" gutterBottom className="protectedTitle">
          This is a protected link
        </Typography>
        <Box className="protectedButton">
          <Button variant="contained" onClick={handleButtonClick}>
            {showLink ? 'Hide Link' : 'Show Link'}
          </Button>
        </Box>
        {showLink && (
          <Box className="protectedLink">
            {/* Your protected page content here */}
            <a href="/protected-link">Protected Link</a>
          </Box>
        )}
      </Paper>
    </Box>
  );
};
