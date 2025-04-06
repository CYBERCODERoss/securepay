import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { TextField, InputAdornment, Box, Typography } from '@mui/material';
import { keyframes } from '@mui/system';

// Define keyframes for animations
const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const pulseError = keyframes`
  0%, 100% {
    transform: translateX(0);
  }
  20%, 60% {
    transform: translateX(-2px);
  }
  40%, 80% {
    transform: translateX(2px);
  }
`;

const focusRing = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(66, 153, 225, 0.2);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(66, 153, 225, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(66, 153, 225, 0);
  }
`;

// Styled TextField with animations
const StyledTextField = styled(TextField)(({ theme, hasError, isFocused, isSuccess }) => ({
  '& .MuiOutlinedInput-root': {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    borderRadius: theme.shape.borderRadius * 1.5,
    
    // Error state animation
    animation: hasError ? `${pulseError} 0.5s ease` : 'none',
    
    // Base styling
    '& fieldset': {
      borderColor: hasError ? theme.palette.error.main : 
                  isSuccess ? theme.palette.success.light : 
                  theme.palette.divider,
      transition: 'border-color 0.2s ease',
    },
    
    // Hover state
    '&:hover fieldset': {
      borderColor: hasError ? theme.palette.error.dark : 
                  isSuccess ? theme.palette.success.main : 
                  theme.palette.primary.light,
    },
    
    // Focused state
    '&.Mui-focused fieldset': {
      borderColor: hasError ? theme.palette.error.main : 
                  isSuccess ? theme.palette.success.main : 
                  theme.palette.primary.main,
      borderWidth: '2px',
    },
    
    // Animation for focus
    ...(isFocused && !hasError && {
      boxShadow: `0 0 0 3px ${theme.palette.primary.light}25`,
      animation: `${focusRing} 2s ease infinite`,
    })
  },
  
  // Input label styling
  '& .MuiInputLabel-root': {
    color: hasError ? theme.palette.error.main : 
           isSuccess ? theme.palette.success.main : 
           theme.palette.text.secondary,
    transition: 'color 0.2s ease, transform 0.2s ease',
    
    '&.Mui-focused': {
      color: hasError ? theme.palette.error.main : 
             isSuccess ? theme.palette.success.main : 
             theme.palette.primary.main,
      fontWeight: 500,
    }
  },
  
  // Helper text styling
  '& .MuiFormHelperText-root': {
    color: hasError ? theme.palette.error.main : 
           isSuccess ? theme.palette.success.main : 
           theme.palette.text.secondary,
    fontWeight: hasError || isSuccess ? 500 : 400,
    transition: 'opacity 0.3s ease',
    marginLeft: theme.spacing(0.5),
    marginTop: theme.spacing(0.5),
  }
}));

// Success indicator component
const SuccessIndicator = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(-4),
  top: '50%',
  transform: 'translateY(-50%)',
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  background: `linear-gradient(120deg, ${theme.palette.success.light}, ${theme.palette.success.main})`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.common.white,
  fontSize: '14px',
  animation: `${shimmer} 2s infinite linear`,
  backgroundSize: '200% 100%',
  boxShadow: `0 2px 8px ${theme.palette.success.main}80`,
  opacity: 0,
  transition: 'opacity 0.3s ease, transform 0.3s ease',
  
  '&.visible': {
    opacity: 1,
    right: theme.spacing(1.5),
  },
  
  '&::before': {
    content: '"✓"',
    display: 'block',
    lineHeight: 1,
  }
}));

const AnimatedTextField = ({
  label,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  startAdornment,
  endAdornment,
  type = 'text',
  multiline = false,
  rows,
  fullWidth = true,
  required = false,
  disabled = false,
  variant = 'outlined',
  successMessage,
  validateOnChange = false,
  validateFn,
  sx = {},
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Calculate states
  const hasError = error || localError;
  const showSuccessIndicator = isSuccess && !hasError;
  const showHelperText = Boolean(helperText || localError || (isSuccess && successMessage));
  const displayHelperText = localError || error || (isSuccess && successMessage ? successMessage : helperText);
  
  // Handle input focus
  const handleFocus = (e) => {
    setIsFocused(true);
    if (props.onFocus) props.onFocus(e);
  };
  
  // Handle input blur 
  const handleBlur = (e) => {
    setIsFocused(false);
    
    // Run validation on blur
    if (validateFn && value) {
      const validationResult = validateFn(value);
      if (validationResult !== true) {
        setLocalError(validationResult);
        setIsSuccess(false);
      } else {
        setLocalError(null);
        setIsSuccess(true);
      }
    }
    
    if (onBlur) onBlur(e);
  };
  
  // Handle input change
  const handleChange = (e) => {
    if (onChange) onChange(e);
    
    // Run validation on change if enabled
    if (validateFn && validateOnChange) {
      const validationResult = validateFn(e.target.value);
      if (validationResult !== true) {
        setLocalError(validationResult);
        setIsSuccess(false);
      } else {
        setLocalError(null);
        setIsSuccess(true);
      }
    }
  };

  return (
    <Box sx={{ position: 'relative', ...sx }}>
      <StyledTextField
        label={label}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        error={Boolean(hasError)}
        helperText={showHelperText ? displayHelperText : ' '}
        type={type}
        multiline={multiline}
        rows={rows}
        fullWidth={fullWidth}
        required={required}
        disabled={disabled}
        variant={variant}
        hasError={Boolean(hasError)}
        isFocused={isFocused}
        isSuccess={isSuccess}
        InputProps={{
          startAdornment: startAdornment && (
            <InputAdornment position="start">
              {startAdornment}
            </InputAdornment>
          ),
          endAdornment: endAdornment && (
            <InputAdornment position="end">
              {endAdornment}
            </InputAdornment>
          )
        }}
        FormHelperTextProps={{
          component: Typography,
          variant: "caption",
        }}
        {...props}
      />
      <SuccessIndicator className={showSuccessIndicator ? 'visible' : ''} />
    </Box>
  );
};

export default AnimatedTextField; 