import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  InputAdornment, 
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Alert,
  Grow
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon, 
  Business as BusinessIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import useAuth from '../hooks/useAuth';
import Button3D from '../components/Button3D';
import Logo from '../components/Logo';
import AnimatedTextField from '../components/AnimatedTextField';

// Step labels
const steps = ['Personal Information', 'Business Details', 'Create Account'];

// Validation schemas for each step
const stepOneValidationSchema = Yup.object({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
});

const stepTwoValidationSchema = Yup.object({
  company: Yup.string()
    .required('Company name is required')
    .min(2, 'Company name must be at least 2 characters'),
  phone: Yup.string()
    .matches(/^[0-9+\-\s()]+$/, 'Invalid phone number format')
    .min(10, 'Phone number is too short')
    .required('Phone number is required'),
});

const stepThreeValidationSchema = Yup.object({
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
  terms: Yup.boolean()
    .oneOf([true], 'You must agree to the terms and conditions'),
});

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, error: authError } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Set error from auth context
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  // Form initialization
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      company: '',
      phone: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
    // Validation schema changes based on the active step
    validationSchema: 
      activeStep === 0 ? stepOneValidationSchema :
      activeStep === 1 ? stepTwoValidationSchema :
      stepThreeValidationSchema,
    
    // We'll handle submission manually depending on the step
    onSubmit: async (values) => {
      if (activeStep < steps.length - 1) {
        handleNext(); // Just move to next step if not on the final step
      } else {
        // Final step - register the user
        await handleRegistration(values);
      }
    },
  });

  const handleRegistration = async (values) => {
    setLoading(true);
    setError(null);
    
    try {
      await register(values);
      setRegisterSuccess(true);
      // Navigation will happen automatically due to the isAuthenticated effect
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  // Step navigation
  const handleNext = () => {
    // Validate current step before proceeding
    const currentSchema = 
      activeStep === 0 ? stepOneValidationSchema :
      activeStep === 1 ? stepTwoValidationSchema :
      stepThreeValidationSchema;
    
    try {
      // Synchronously validate the form
      currentSchema.validateSync(formik.values, { abortEarly: false });
      
      // If validation passes, move to next step
      setActiveStep((prevStep) => prevStep + 1);
      setError(null);
    } catch (err) {
      // Show validation error and trigger formik validation
      formik.validateForm();
      
      // Focus on first invalid field
      const firstError = err.inner[0]?.path;
      if (firstError && document.getElementById(firstError)) {
        document.getElementById(firstError).focus();
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
    setError(null);
  };

  // Password visibility toggling
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Get the fields to display based on the active step
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <AnimatedTextField
              fullWidth
              id="firstName"
              name="firstName"
              label="First Name"
              variant="outlined"
              margin="normal"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.firstName && Boolean(formik.errors.firstName)}
              helperText={formik.touched.firstName && formik.errors.firstName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              disabled={loading || registerSuccess}
            />

            <AnimatedTextField
              fullWidth
              id="lastName"
              name="lastName"
              label="Last Name"
              variant="outlined"
              margin="normal"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              helperText={formik.touched.lastName && formik.errors.lastName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              disabled={loading || registerSuccess}
            />

            <AnimatedTextField
              fullWidth
              id="email"
              name="email"
              label="Email Address"
              variant="outlined"
              margin="normal"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              disabled={loading || registerSuccess}
            />
          </>
        );
      case 1:
        return (
          <>
            <AnimatedTextField
              fullWidth
              id="company"
              name="company"
              label="Company Name"
              variant="outlined"
              margin="normal"
              value={formik.values.company}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.company && Boolean(formik.errors.company)}
              helperText={formik.touched.company && formik.errors.company}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              disabled={loading || registerSuccess}
            />

            <AnimatedTextField
              fullWidth
              id="phone"
              name="phone"
              label="Phone Number"
              variant="outlined"
              margin="normal"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              disabled={loading || registerSuccess}
            />
          </>
        );
      case 2:
        return (
          <>
            <AnimatedTextField
              fullWidth
              id="password"
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              disabled={loading || registerSuccess}
            />

            <AnimatedTextField
              fullWidth
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleToggleConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              disabled={loading || registerSuccess}
            />

            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
              <AnimatedTextField
                id="terms"
                name="terms"
                type="checkbox"
                checked={formik.values.terms}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.terms && Boolean(formik.errors.terms)}
                helperText={formik.touched.terms && formik.errors.terms}
                label={
                  <Typography variant="body2" color="textSecondary">
                    I agree to the{' '}
                    <Link to="/terms" style={{ textDecoration: 'none', color: '#1976d2' }}>
                      Terms and Conditions
                    </Link>
                  </Typography>
                }
                disabled={loading || registerSuccess}
              />
            </Box>
          </>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: (theme) => 
          `linear-gradient(120deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          top: '-100px',
          right: '-100px',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
          bottom: '-50px',
          left: '-50px',
          zIndex: 0,
        }}
      />

      <Container maxWidth="md" sx={{ zIndex: 1 }}>
        <Paper 
          elevation={4}
          sx={{ 
            borderRadius: 2,
            overflow: 'hidden',
            backgroundColor: 'background.paper',
            p: { xs: 3, sm: 4, md: 5 },
          }}
        >
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
            <Logo variant="horizontal" />
          </Box>
          
          <Typography 
            variant="h4" 
            component="h1" 
            fontWeight="bold" 
            align="center"
            sx={{ mb: 1 }}
          >
            Create an Account
          </Typography>
          
          <Typography 
            variant="body1" 
            color="textSecondary" 
            align="center" 
            sx={{ mb: 4 }}
          >
            Join SecurePay for safer, faster payments
          </Typography>

          {/* Error message */}
          {error && (
            <Grow in={!!error}>
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                {error}
              </Alert>
            </Grow>
          )}

          {/* Success message */}
          {registerSuccess && (
            <Grow in={registerSuccess}>
              <Alert severity="success" sx={{ mb: 3 }}>
                Registration successful! Redirecting to dashboard...
              </Alert>
            </Grow>
          )}

          {/* Registration Stepper */}
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <form onSubmit={formik.handleSubmit}>
            {getStepContent(activeStep)}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button3D
                disabled={activeStep === 0 || loading || registerSuccess}
                onClick={handleBack}
                variant="outlined"
              >
                Back
              </Button3D>
              
              <Button3D
                type={activeStep === steps.length - 1 ? 'submit' : 'button'}
                onClick={activeStep === steps.length - 1 ? undefined : handleNext}
                disabled={loading || registerSuccess}
                isLoading={loading}
              >
                {activeStep === steps.length - 1 ? 'Register' : 'Next'}
              </Button3D>
            </Box>
          </form>

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body2" color="textSecondary">
              Already have an account?{' '}
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Typography 
                  component="span" 
                  variant="body2" 
                  color="primary" 
                  fontWeight="600"
                  sx={{ '&:hover': { textDecoration: 'underline' } }}
                >
                  Sign In
                </Typography>
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register; 