import React from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center',
          py: 8,
        }}
      >
        <Typography variant="h1" component="h1" sx={{ fontSize: '120px', fontWeight: 700, color: 'primary.main' }}>
          404
        </Typography>
        
        <Typography variant="h4" component="h2" sx={{ mt: 2, mb: 4 }}>
          Page Not Found
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 6, maxWidth: 600 }}>
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </Typography>
        
        <Button 
          variant="contained" 
          size="large" 
          onClick={() => navigate('/')}
          sx={{ 
            px: 4, 
            py: 1.5,
            fontSize: '1rem',
          }}
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound; 