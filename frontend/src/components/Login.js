import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  Alert,
  CircularProgress,
  Divider,
  InputAdornment,
  IconButton,
  Stack,
  Paper,
  GlobalStyles,
  Container,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SecurityIcon from '@mui/icons-material/Security';
import GitHubIcon from '@mui/icons-material/GitHub';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import { styled, keyframes, alpha } from '@mui/material/styles';
import useAuth from '../hooks/useAuth';

// Keyframes animations for subtle background effect
const gradientMove = keyframes`
  0% { background-position: 0% 50% }
  50% { background-position: 100% 50% }
  100% { background-position: 0% 50% }
`;

// Dark background with subtle pattern
const DarkBackground = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), 
                   radial-gradient(#333 1px, transparent 1px)`,
  backgroundSize: '100% 100%, 30px 30px',
  minHeight: '100vh',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
}));

// Subtle gradient overlay
const GradientOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  opacity: 0.07,
  background: 'linear-gradient(-45deg, #1976d2, #1e88e5, #0d47a1, #0277bd)',
  backgroundSize: '400% 400%',
  animation: `${gradientMove} 15s ease infinite`,
  zIndex: 0,
}));

// Logo container with subtle glow
const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 50,
  height: 50,
  borderRadius: '10px',
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
  boxShadow: `0 0 15px ${alpha(theme.palette.primary.main, 0.2)}`,
  marginBottom: theme.spacing(3),
}));

// Card container for login form
const LoginCard = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: 12,
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: 420,
  position: 'relative',
  zIndex: 1,
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
}));

// Styled feature section
const FeatureSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  '&:last-child': {
    borderBottom: 'none',
    marginBottom: 0,
    paddingBottom: 0,
  }
}));

// Feature icon container
const FeatureIconBox = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  marginRight: theme.spacing(2),
  color: theme.palette.primary.main,
}));

const Login = () => {
  const navigate = useNavigate();
  const { login, loading: authLoading, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      if (!authError) {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <GlobalStyles 
        styles={{ 
          body: { 
            margin: 0, 
            padding: 0,
            height: '100vh',
            width: '100vw',
            backgroundColor: '#121212',
          } 
        }} 
      />
      <DarkBackground>
        <GradientOverlay />
        <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <Grid container spacing={3} justifyContent="center" alignItems="center">
            {/* Left column - Login form */}
            <Grid item xs={12} md={5}>
              <LoginCard elevation={0}>
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                  <LogoContainer>
                    <GitHubIcon color="primary" fontSize="large" />
                  </LogoContainer>
                  <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                    Sign In
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Enter your credentials to access your account
                  </Typography>
                </Box>

                {(error || authError) && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error || authError}
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  <Box sx={{ mb: 3 }}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 4 }}>
                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={togglePasswordVisibility}
                              edge="end"
                              size="small"
                            >
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="body2" component={Link} href="#" color="primary">
                      Forgot password?
                    </Typography>
                  </Box>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading || authLoading}
                    sx={{ 
                      py: 1.2,
                      position: 'relative'
                    }}
                  >
                    {(loading || authLoading) ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : 'Sign In'}
                  </Button>
                </form>

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Don't have an account?{' '}
                    <Link href="/register" underline="hover" color="primary" sx={{ fontWeight: 500 }}>
                      Sign up
                    </Link>
                  </Typography>
                </Box>
              </LoginCard>
            </Grid>

            {/* Right column - Features */}
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box sx={{ p: 4, color: 'text.primary' }}>
                <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mb: 4 }}>
                  Blacksmith Analytics Platform
                </Typography>

                <FeatureSection>
                  <FeatureIconBox>
                    <SecurityIcon />
                  </FeatureIconBox>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Secure GitHub Integrations
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Connect your repos safely with our OAuth-based secure authentication
                    </Typography>
                  </Box>
                </FeatureSection>

                <FeatureSection>
                  <FeatureIconBox>
                    <GitHubIcon />
                  </FeatureIconBox>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      GitHub Actions Analytics
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Deep insights into your CI/CD workflows and build processes
                    </Typography>
                  </Box>
                </FeatureSection>

                <FeatureSection>
                  <FeatureIconBox>
                    <AlternateEmailIcon />
                  </FeatureIconBox>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Real-time Notifications
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Get instant alerts when your actions succeed or fail
                    </Typography>
                  </Box>
                </FeatureSection>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </DarkBackground>
    </>
  );
};

export default Login; 