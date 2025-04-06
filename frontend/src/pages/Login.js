import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  TextField, 
  InputAdornment, 
  IconButton,
  Alert,
  Grow,
  Paper,
  Divider
} from '@mui/material';
import { Visibility, VisibilityOff, Email as EmailIcon, Lock as LockIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import useAuth from '../hooks/useAuth';
import Button3D from '../components/Button3D';
import Logo from '../components/Logo';
import AnimatedTextField from '../components/AnimatedTextField';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, error: authError } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loginSuccess, setLoginSuccess] = useState(false);

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

  // Form validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Please enter a valid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
  });

  // Initialize formik
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      try {
        await login(values.email, values.password);
        setLoginSuccess(true);
        // Navigation will happen automatically due to the isAuthenticated effect
      } catch (err) {
        setError(err.message || 'Login failed. Please check your credentials.');
        setLoading(false);
      }
    },
  });

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  // Demo user credentials for quick testing
  const demoUsers = [
    { email: 'john.smith@example.com', password: 'Password123', role: 'Admin' },
    { email: 'alice@example.com', password: 'SecurePass456', role: 'User' },
    { email: 'demo@securepay.com', password: 'demo123', role: 'Demo' }
  ];

  const loginWithDemoUser = (email, password) => {
    formik.setValues({ email, password });
    // Let the user see what credentials were filled in
    setTimeout(() => {
      formik.handleSubmit();
    }, 300);
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
        <Grid 
          container 
          spacing={0} 
          sx={{ 
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          {/* Left side - Login form */}
          <Grid 
            item 
            xs={12} 
            md={6} 
            sx={{ 
              backgroundColor: 'background.paper',
              p: { xs: 3, sm: 4, md: 5 },
              display: 'flex',
              flexDirection: 'column',
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
              Welcome Back
            </Typography>
            
            <Typography 
              variant="body1" 
              color="textSecondary" 
              align="center" 
              sx={{ mb: 4 }}
            >
              Login to your secure account
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
            {loginSuccess && (
              <Grow in={loginSuccess}>
                <Alert severity="success" sx={{ mb: 3 }}>
                  Login successful! Redirecting...
                </Alert>
              </Grow>
            )}

            <form onSubmit={formik.handleSubmit}>
              <AnimatedTextField
                fullWidth
                id="email"
                name="email"
                label="Email"
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
                disabled={loading || loginSuccess}
              />

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
                disabled={loading || loginSuccess}
              />

              <Box sx={{ mt: 2, mb: 2, textAlign: 'right' }}>
                <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                  <Typography variant="body2" color="primary" sx={{ '&:hover': { textDecoration: 'underline' } }}>
                    Forgot password?
                  </Typography>
                </Link>
              </Box>

              <Button3D
                type="submit"
                fullWidth
                size="large"
                disabled={loading || loginSuccess}
                isLoading={loading}
                sx={{ mb: 3, mt: 1 }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button3D>

              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="body2" color="textSecondary">
                  Don't have an account?{' '}
                  <Link to="/register" style={{ textDecoration: 'none' }}>
                    <Typography 
                      component="span" 
                      variant="body2" 
                      color="primary" 
                      fontWeight="600"
                      sx={{ '&:hover': { textDecoration: 'underline' } }}
                    >
                      Sign Up
                    </Typography>
                  </Link>
                </Typography>
              </Box>
              
              {/* Demo accounts section */}
              <Box sx={{ mt: 4 }}>
                <Divider sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Demo Accounts
                  </Typography>
                </Divider>
                
                <Grid container spacing={2}>
                  {demoUsers.map((user, index) => (
                    <Grid item xs={12} key={index}>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2, 
                          border: '1px solid', 
                          borderColor: 'divider',
                          borderRadius: 1,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          '&:hover': {
                            borderColor: 'primary.main',
                            transform: 'translateY(-2px)'
                          }
                        }}
                        onClick={() => loginWithDemoUser(user.email, user.password)}
                      >
                        <Typography variant="subtitle2" fontWeight="bold">{user.role} Account</Typography>
                        <Typography variant="caption" display="block" color="textSecondary">
                          Email: {user.email}
                        </Typography>
                        <Typography variant="caption" display="block" color="textSecondary">
                          Password: {user.password}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </form>
          </Grid>

          {/* Right side - Information/Marketing */}
          <Grid 
            item 
            xs={12} 
            md={6} 
            sx={{ 
              background: (theme) => 
                `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              p: 5,
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Decorative elements */}
            <Box sx={{
              position: 'absolute',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              top: '10%',
              right: '-50px'
            }} />
            
            <Box sx={{
              position: 'absolute',
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              bottom: '10%',
              left: '-30px'
            }} />
            
            <Typography 
              variant="h4" 
              component="h2" 
              fontWeight="bold" 
              sx={{ mb: 3, position: 'relative', zIndex: 1 }}
            >
              Secure Payment Processing
            </Typography>
            
            <Typography 
              variant="body1" 
              align="center" 
              sx={{ 
                mb: 4, 
                position: 'relative', 
                zIndex: 1,
                opacity: 0.9
              }}
            >
              Take control of your financial transactions with our state-of-the-art
              secure payment platform. Advanced encryption and fraud detection keep
              your data safe.
            </Typography>
            
            <Box 
              sx={{ 
                mt: 3, 
                p: 3, 
                bgcolor: 'rgba(255, 255, 255, 0.1)', 
                borderRadius: 2,
                backdropFilter: 'blur(10px)',
                position: 'relative',
                zIndex: 1
              }}
            >
              <Typography variant="h6" fontWeight="medium" sx={{ mb: 1 }}>
                Key Features
              </Typography>
              
              {[
                'End-to-end encryption for all transactions',
                'Real-time fraud detection and prevention',
                'Detailed financial reporting and analytics',
                'Customizable payment solutions for any business'
              ].map((feature, index) => (
                <Typography 
                  key={index} 
                  variant="body2" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mt: 1,
                    opacity: 0.9
                  }}
                >
                  <Box 
                    component="span" 
                    sx={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      bgcolor: 'white',
                      mr: 1,
                      display: 'inline-block'
                    }}
                  />
                  {feature}
                </Typography>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Login; 