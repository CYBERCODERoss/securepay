import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Button, Box, Typography } from '@mui/material';
import { keyframes } from '@mui/system';

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const ButtonWrapper = styled(Box)(({ theme, color, size, disabled, active }) => {
  // Determine colors based on variant
  const colors = {
    primary: {
      main: theme.palette.primary.main,
      gradient: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
      hover: 'linear-gradient(90deg, #1565c0 0%, #1976d2 100%)',
      shadow: 'rgba(25, 118, 210, 0.5)',
      light: '#E1F5FE',
      text: '#ffffff'
    },
    secondary: {
      main: theme.palette.secondary.main,
      gradient: 'linear-gradient(90deg, #7b1fa2 0%, #9c27b0 100%)',
      hover: 'linear-gradient(90deg, #6a1b9a 0%, #7b1fa2 100%)',
      shadow: 'rgba(123, 31, 162, 0.5)',
      light: '#F3E5F5',
      text: '#ffffff'
    },
    success: {
      main: theme.palette.success.main,
      gradient: 'linear-gradient(90deg, #2e7d32 0%, #4caf50 100%)',
      hover: 'linear-gradient(90deg, #1b5e20 0%, #2e7d32 100%)',
      shadow: 'rgba(46, 125, 50, 0.5)',
      light: '#E8F5E9',
      text: '#ffffff'
    },
    error: {
      main: theme.palette.error.main,
      gradient: 'linear-gradient(90deg, #d32f2f 0%, #ef5350 100%)',
      hover: 'linear-gradient(90deg, #c62828 0%, #d32f2f 100%)',
      shadow: 'rgba(211, 47, 47, 0.5)',
      light: '#FFEBEE',
      text: '#ffffff'
    },
    warning: {
      main: theme.palette.warning.main,
      gradient: 'linear-gradient(90deg, #ed6c02 0%, #ff9800 100%)',
      hover: 'linear-gradient(90deg, #e65100 0%, #ed6c02 100%)',
      shadow: 'rgba(237, 108, 2, 0.5)',
      light: '#FFF3E0',
      text: '#ffffff'
    },
    info: {
      main: theme.palette.info.main,
      gradient: 'linear-gradient(90deg, #0288d1 0%, #03a9f4 100%)',
      hover: 'linear-gradient(90deg, #01579b 0%, #0288d1 100%)',
      shadow: 'rgba(2, 136, 209, 0.5)',
      light: '#E1F5FE',
      text: '#ffffff'
    },
    dark: {
      main: '#212121',
      gradient: 'linear-gradient(90deg, #212121 0%, #424242 100%)',
      hover: 'linear-gradient(90deg, #000000 0%, #212121 100%)',
      shadow: 'rgba(33, 33, 33, 0.5)',
      light: '#F5F5F5',
      text: '#ffffff'
    },
    light: {
      main: '#f5f5f5',
      gradient: 'linear-gradient(90deg, #f5f5f5 0%, #ffffff 100%)',
      hover: 'linear-gradient(90deg, #e0e0e0 0%, #f5f5f5 100%)',
      shadow: 'rgba(0, 0, 0, 0.1)',
      light: '#ffffff',
      text: '#212121'
    }
  };

  const selectedColor = colors[color] || colors.primary;
  
  // Determine size
  const sizes = {
    small: {
      height: '36px',
      padding: '0 16px',
      fontSize: '0.875rem',
      borderRadius: '8px',
      bottom: '4px'
    },
    medium: {
      height: '44px',
      padding: '0 22px',
      fontSize: '0.9375rem',
      borderRadius: '10px',
      bottom: '5px'
    },
    large: {
      height: '52px',
      padding: '0 28px',
      fontSize: '1rem',
      borderRadius: '12px',
      bottom: '6px'
    }
  };
  
  const selectedSize = sizes[size] || sizes.medium;
  
  return {
    position: 'relative',
    display: 'inline-block',
    transition: 'all 0.3s ease',
    transform: disabled ? 'scale(1)' : active ? 'scale(0.97) translateY(2px)' : 'scale(1)',
    marginBottom: selectedSize.bottom,
    width: '100%',
    
    '& .button-3d-face': {
      height: selectedSize.height,
      padding: selectedSize.padding,
      fontSize: selectedSize.fontSize,
      borderRadius: selectedSize.borderRadius,
      background: disabled ? theme.palette.action.disabledBackground : selectedColor.gradient,
      color: disabled ? theme.palette.action.disabled : selectedColor.text,
      fontWeight: 600,
      border: 'none',
      transition: 'all 0.3s ease',
      position: 'relative',
      textTransform: 'none',
      zIndex: 2,
      fontFamily: theme.typography.fontFamily,
      boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
      letterSpacing: '0.5px',
      width: '100%',
      
      '&:hover': {
        background: !disabled && selectedColor.hover,
      }
    },
    
    '& .button-3d-shadow': {
      position: 'absolute',
      bottom: disabled ? 0 : active ? '-2px' : selectedSize.bottom === '4px' ? '-4px' : selectedSize.bottom === '5px' ? '-5px' : '-6px',
      left: 0,
      width: '100%',
      height: selectedSize.height,
      borderRadius: selectedSize.borderRadius,
      background: disabled ? 'transparent' : selectedColor.main,
      opacity: disabled ? 0 : 1,
      transition: 'all 0.3s ease',
      zIndex: 1,
    },
    
    '&:hover': {
      transform: disabled ? 'scale(1)' : 'scale(1.01)',
      
      '& .button-3d-face': {
        boxShadow: disabled ? 'none' : '0 4px 12px rgba(0,0,0,0.1)',
      }
    },
    
    '&:active': {
      transform: disabled ? 'scale(1)' : 'scale(0.97) translateY(2px)',
      
      '& .button-3d-shadow': {
        bottom: '-2px',
      }
    },
    
    ...(color === 'rainbow' && {
      '& .button-3d-face': {
        background: 'linear-gradient(90deg, #ff0000, #ffa500, #ffff00, #008000, #0000ff, #4b0082, #ee82ee)',
        backgroundSize: '400% 100%',
        animation: `${shimmer} 8s linear infinite`,
      },
      '& .button-3d-shadow': {
        background: '#9c27b0'
      }
    })
  };
});

const Button3D = ({
  children,
  color = 'primary',
  size = 'medium',
  disabled = false,
  startIcon,
  endIcon,
  fullWidth = false,
  onClick,
  type = 'button',
  ...props
}) => {
  const [active, setActive] = useState(false);
  
  const handleMouseDown = (e) => {
    if (!disabled) {
      setActive(true);
      
      // For form submission, let it propagate
      if (type === 'submit' && onClick) {
        onClick(e);
      }
    }
  };
  
  const handleMouseUp = () => {
    if (!disabled) {
      setActive(false);
    }
  };
  
  const handleClick = (e) => {
    if (!disabled && onClick) {
      console.log("Button3D clicked - executing onClick handler");
      onClick(e);
    } else {
      console.log("Button3D clicked but no onClick handler or disabled", { disabled, hasOnClick: !!onClick });
    }
  };

  return (
    <ButtonWrapper
      color={color}
      size={size}
      disabled={disabled}
      active={active}
      sx={{
        width: fullWidth ? '100%' : 'auto',
        ...props.sx
      }}
      onClick={handleClick}
    >
      <Button
        className="button-3d-face"
        disabled={disabled}
        type={type}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        startIcon={startIcon}
        endIcon={endIcon}
        fullWidth={fullWidth}
      >
        {typeof children === 'string' ? (
          <Typography variant="button" component="span" fontWeight="inherit">
            {children}
          </Typography>
        ) : (
          children
        )}
      </Button>
      <div className="button-3d-shadow" />
    </ButtonWrapper>
  );
};

export default Button3D;