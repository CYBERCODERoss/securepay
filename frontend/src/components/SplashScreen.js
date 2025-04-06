import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Fade } from '@mui/material';
import Logo from './Logo';

const SplashScreen = ({ message = "Loading application..." }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // After 3 seconds, start fade out
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Fade
      in={!fadeOut}
      timeout={{ exit: 800 }}
      style={{
        transitionDelay: fadeOut ? '0ms' : '300ms',
      }}
    >
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'background.default',
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': {
                transform: 'scale(1)',
              },
              '50%': {
                transform: 'scale(1.05)',
              },
              '100%': {
                transform: 'scale(1)',
              },
            },
          }}
        >
          <Logo variant="large" />
          
          <Typography
            variant="h5"
            sx={{
              color: 'white',
              fontWeight: 500,
              mt: 4,
              textAlign: 'center',
              maxWidth: '80%',
              textShadow: '0 2px 10px rgba(0,0,0,0.1)',
            }}
          >
            Secure Payments Made Simple
          </Typography>
          
          <Typography
            variant="body1"
            sx={{
              color: 'white',
              opacity: 0.9,
              mt: 1,
              textAlign: 'center',
              maxWidth: '80%',
            }}
          >
            {message}
          </Typography>
          
          <CircularProgress
            size={48}
            thickness={4}
            sx={{
              mt: 4,
              color: 'white',
            }}
          />
        </Box>
        
        <Typography
          variant="caption"
          sx={{
            color: 'white',
            opacity: 0.7,
            position: 'absolute',
            bottom: 24,
            left: 0,
            right: 0,
            textAlign: 'center',
          }}
        >
          © {new Date().getFullYear()} SecurePay. All rights reserved.
        </Typography>
      </Box>
    </Fade>
  );
};

export default SplashScreen; 