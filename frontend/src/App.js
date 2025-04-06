import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Shop from './pages/Shop';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import SplashScreen from './components/SplashScreen';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import theme from './theme';

// Import all page components from pages folder
import Payments from './pages/Payments';
import Transactions from './pages/Transactions';
import Subscriptions from './pages/Subscriptions';
import Security from './pages/Security';
import Settings from './pages/Settings';
import FraudProtection from './pages/FraudProtection';

// App wrapper component to access auth context
const AppContent = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { loading, sessionChecked, checkSession } = React.useContext(AuthContext);

  useEffect(() => {
    // Initial session check
    checkSession();

    // Hide splash screen after loading is complete and session is checked
    if (!loading && sessionChecked) {
      // Give a little extra time for the splash screen
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 1000); // Ensures splash screen shows for at least 1 second after auth check

      return () => clearTimeout(timer);
    }
  }, [loading, sessionChecked, checkSession]);

  // Set up interval to periodically check session
  useEffect(() => {
    const sessionInterval = setInterval(() => {
      checkSession();
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(sessionInterval);
  }, [checkSession]);

  // Show splash screen during initial load
  if (showSplash) {
    return <SplashScreen message="Preparing your secure environment..." />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/payments" element={<Payments />} />
            <Route path="/dashboard/transactions" element={<Transactions />} />
            <Route path="/dashboard/subscriptions" element={<Subscriptions />} />
            <Route path="/dashboard/security" element={<Security />} />
            <Route path="/dashboard/settings" element={<Settings />} />
            <Route path="/dashboard/fraud-protection" element={<FraudProtection />} />
            <Route path="/shop" element={<Shop />} />
          </Route>
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 