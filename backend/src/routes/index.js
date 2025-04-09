const express = require('express');
const router = express.Router();

// Import route handlers
const authRoutes = require('./auth.routes');
const paymentRoutes = require('./payment.routes');
const subscriptionRoutes = require('./subscription.routes');
const analyticsRoutes = require('./analytics.routes');
const notificationRoutes = require('./notification.routes');
const fraudRoutes = require('./fraud.routes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/payments', paymentRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/notifications', notificationRoutes);
router.use('/fraud', fraudRoutes);

module.exports = router; 