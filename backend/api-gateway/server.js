const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'securepay_jwt_secret_key';

// Define service URLs from environment variables
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:8081';
const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://payment-service:8082';
const SUBSCRIPTION_SERVICE_URL = process.env.SUBSCRIPTION_SERVICE_URL || 'http://subscription-service:8083';
const ANALYTICS_SERVICE_URL = process.env.ANALYTICS_SERVICE_URL || 'http://analytics-service:8084';
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:8085';
const FRAUD_SERVICE_URL = process.env.FRAUD_SERVICE_URL || 'http://fraud-service:8086';

// Middleware
app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticateJWT = (req, res, next) => {
  // Skip auth for login and register endpoints
  if (req.path === '/api/auth/login' || req.path === '/api/auth/register') {
    return next();
  }

  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
      }

      req.user = user;
      next();
    });
  } else {
    // For development purposes, allow requests without token
    // In production, you would comment this out and only use the else clause
    if (process.env.NODE_ENV === 'development') {
      console.log('WARNING: Request without authentication token allowed in development mode');
      next();
    } else {
      res.status(401).json({ message: 'Authentication token required' });
    }
  }
};

// Apply authentication middleware to all routes except health check
app.use('/api', authenticateJWT);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API Gateway is running' });
});

// Setup proxy routes to microservices
// Auth Service Proxy
app.use('/api/auth', createProxyMiddleware({
  target: AUTH_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth': '/api/auth'
  }
}));

// Payment Service Proxy
app.use('/api/payments', createProxyMiddleware({
  target: PAYMENT_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/payments': '/api'
  }
}));

// Subscription Service Proxy
app.use('/api/subscriptions', createProxyMiddleware({
  target: SUBSCRIPTION_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/subscriptions': '/api'
  }
}));

// Analytics Service Proxy
app.use('/api/analytics', createProxyMiddleware({
  target: ANALYTICS_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/analytics': '/api'
  }
}));

// Notification Service Proxy
app.use('/api/notifications', createProxyMiddleware({
  target: NOTIFICATION_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/notifications': '/api'
  }
}));

// Fraud Service Proxy
app.use('/api/fraud', createProxyMiddleware({
  target: FRAUD_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/fraud': '/api'
  }
}));

// Fallback route
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});

module.exports = app; 