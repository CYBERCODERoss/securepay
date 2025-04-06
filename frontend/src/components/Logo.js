import React from 'react';
import { Box, Typography } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import { keyframes } from '@mui/system';

const pulse = keyframes`
  0% {
    transform: scale(1);
    filter: drop-shadow(0 0 5px rgba(25, 118, 210, 0.4));
  }
  50% {
    transform: scale(1.05);
    filter: drop-shadow(0 0 12px rgba(25, 118, 210, 0.7));
  }
  100% {
    transform: scale(1);
    filter: drop-shadow(0 0 5px rgba(25, 118, 210, 0.4));
  }
`;

const rotate = keyframes`
  0% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(360deg);
  }
`;

const Logo = ({ variant = 'default', showText = true }) => {
  const sizes = {
    small: {
      iconSize: 24,
      fontSize: '1.2rem',
      fontWeight: 600,
    },
    default: {
      iconSize: 36,
      fontSize: '1.5rem',
      fontWeight: 700,
    },
    large: {
      iconSize: 48,
      fontSize: '2rem',
      fontWeight: 800,
    },
  };

  const currentSize = sizes[variant] || sizes.default;

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: 1,
        perspective: '1000px',
        transform: 'translate3d(0, 0, 0)',
        transition: 'all 0.3s ease',
        '&:hover .logo-icon': {
          animation: `${rotate} 1s ease-in-out`,
        },
      }}
    >
      <Box 
        className="logo-icon"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          width: currentSize.iconSize + 12,
          height: currentSize.iconSize + 12,
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          transform: 'perspective(500px) rotateY(10deg) rotateX(5deg)',
          boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.15), -2px -2px 8px rgba(255, 255, 255, 0.1)',
          animation: `${pulse} 3s infinite ease-in-out`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: 'inherit',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%)',
            zIndex: 1
          }
        }}
      >
        <SecurityIcon 
          sx={{ 
            color: 'white',
            fontSize: currentSize.iconSize,
            zIndex: 2,
            filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.2))'
          }} 
        />
      </Box>
      
      {showText && (
        <Typography 
          variant="h6" 
          component="div"
          sx={{ 
            fontSize: currentSize.fontSize, 
            fontWeight: currentSize.fontWeight,
            background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.5px',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
            fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
            userSelect: 'none'
          }}
        >
          SecurePay
        </Typography>
      )}
    </Box>
  );
};

export default Logo; 