const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 8085;

// Mock notification data for demonstration
const notifications = [
  {
    id: 'notif-001',
    userId: 'user-001',
    type: 'payment_successful',
    title: 'Payment Successful',
    message: 'Your payment of $125.50 has been successfully processed.',
    metadata: {
      paymentId: 'pmt-001',
      amount: 125.50,
      currency: 'USD'
    },
    read: false,
    createdAt: '2023-05-15T10:30:10Z'
  },
  {
    id: 'notif-002',
    userId: 'user-001',
    type: 'subscription_renewed',
    title: 'Subscription Renewed',
    message: 'Your Premium Plan subscription has been renewed for another month.',
    metadata: {
      subscriptionId: 'sub-002',
      planName: 'Premium Plan',
      nextBillingDate: '2023-06-15T00:00:00Z'
    },
    read: true,
    createdAt: '2023-05-15T09:15:00Z'
  },
  {
    id: 'notif-003',
    userId: 'user-002',
    type: 'payment_failed',
    title: 'Payment Failed',
    message: 'Your payment of $49.99 could not be processed. Please update your payment method.',
    metadata: {
      paymentId: 'pmt-003',
      amount: 49.99,
      currency: 'USD',
      errorCode: 'insufficient_funds'
    },
    read: false,
    createdAt: '2023-05-16T14:22:05Z'
  },
  {
    id: 'notif-004',
    userId: 'user-001',
    type: 'fraud_alert',
    title: 'Unusual Activity Detected',
    message: 'We\'ve detected unusual activity on your account. Please review recent transactions.',
    metadata: {
      alertId: 'alert-001'
    },
    read: false,
    createdAt: '2023-05-17T08:45:30Z'
  }
];

// Notification templates
const templates = {
  payment_successful: {
    title: 'Payment Successful',
    message: 'Your payment of {amount} {currency} has been successfully processed.',
    channels: ['email', 'push', 'in_app']
  },
  payment_failed: {
    title: 'Payment Failed',
    message: 'Your payment of {amount} {currency} could not be processed. Please update your payment method.',
    channels: ['email', 'push', 'in_app', 'sms']
  },
  subscription_renewed: {
    title: 'Subscription Renewed',
    message: 'Your {planName} subscription has been renewed for another {interval}.',
    channels: ['email', 'in_app']
  },
  subscription_canceled: {
    title: 'Subscription Canceled',
    message: 'Your {planName} subscription has been canceled.',
    channels: ['email', 'in_app']
  },
  fraud_alert: {
    title: 'Unusual Activity Detected',
    message: 'We\'ve detected unusual activity on your account. Please review recent transactions.',
    channels: ['email', 'push', 'in_app', 'sms']
  }
};

// Function to create notification content from template
const generateContent = (template, data) => {
  let { title, message } = templates[template];
  
  // Replace placeholders in title
  Object.keys(data).forEach(key => {
    title = title.replace(`{${key}}`, data[key]);
  });
  
  // Replace placeholders in message
  Object.keys(data).forEach(key => {
    message = message.replace(`{${key}}`, data[key]);
  });
  
  return { title, message };
};

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Notification service is running' });
});

// Get all notifications for a user
app.get('/api/notifications/:userId', (req, res) => {
  const userNotifications = notifications.filter(n => n.userId === req.params.userId);
  res.status(200).json(userNotifications);
});

// Get notification by ID
app.get('/api/notifications/:userId/:id', (req, res) => {
  const notification = notifications.find(n => n.id === req.params.id && n.userId === req.params.userId);
  
  if (!notification) {
    return res.status(404).json({ message: 'Notification not found' });
  }
  
  res.status(200).json(notification);
});

// Mark notification as read
app.put('/api/notifications/:userId/:id/read', (req, res) => {
  const notification = notifications.find(n => n.id === req.params.id && n.userId === req.params.userId);
  
  if (!notification) {
    return res.status(404).json({ message: 'Notification not found' });
  }
  
  notification.read = true;
  
  res.status(200).json(notification);
});

// Mark all notifications as read for a user
app.put('/api/notifications/:userId/read-all', (req, res) => {
  const userNotifications = notifications.filter(n => n.userId === req.params.userId);
  
  userNotifications.forEach(notification => {
    notification.read = true;
  });
  
  res.status(200).json({ message: 'All notifications marked as read', count: userNotifications.length });
});

// Send a notification
app.post('/api/notifications/send', (req, res) => {
  const { userId, type, data, channels } = req.body;
  
  if (!userId || !type || !data) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  if (!templates[type]) {
    return res.status(400).json({ message: 'Invalid notification type' });
  }
  
  const { title, message } = generateContent(type, data);
  
  const newNotification = {
    id: `notif-${uuidv4().slice(0, 8)}`,
    userId,
    type,
    title,
    message,
    metadata: data,
    read: false,
    createdAt: new Date().toISOString()
  };
  
  // Add notification to the array
  notifications.push(newNotification);
  
  // In a real implementation, this would send the notification via the requested channels
  const requestedChannels = channels || templates[type].channels;
  
  const response = {
    id: newNotification.id,
    title,
    message,
    sentTo: {
      userId,
      channels: requestedChannels
    },
    createdAt: newNotification.createdAt
  };
  
  res.status(201).json(response);
});

// Delete a notification
app.delete('/api/notifications/:userId/:id', (req, res) => {
  const index = notifications.findIndex(n => n.id === req.params.id && n.userId === req.params.userId);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Notification not found' });
  }
  
  const deleted = notifications.splice(index, 1)[0];
  
  res.status(200).json({ message: 'Notification deleted', notification: deleted });
});

// Get notification templates
app.get('/api/notifications/templates', (req, res) => {
  res.status(200).json(templates);
});

// Handle 404 routes
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
  console.log(`Notification service running on port ${PORT}`);
});

module.exports = app; 