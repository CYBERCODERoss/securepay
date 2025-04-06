const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 8083;

// Mock subscription data for demonstration
const subscriptions = [
  {
    id: 'sub-001',
    name: 'Basic Plan',
    customerId: 'cus-001',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    status: 'active',
    amount: 19.99,
    currency: 'USD',
    interval: 'month',
    startDate: '2023-01-15T00:00:00Z',
    nextBillingDate: '2023-06-15T00:00:00Z',
    createdAt: '2023-01-15T00:00:00Z'
  },
  {
    id: 'sub-002',
    name: 'Premium Plan',
    customerId: 'cus-002',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    status: 'active',
    amount: 49.99,
    currency: 'USD',
    interval: 'month',
    startDate: '2023-02-10T00:00:00Z',
    nextBillingDate: '2023-06-10T00:00:00Z',
    createdAt: '2023-02-10T00:00:00Z'
  },
  {
    id: 'sub-003',
    name: 'Enterprise Plan',
    customerId: 'cus-003',
    customerName: 'Acme Corp',
    customerEmail: 'billing@acme.com',
    status: 'active',
    amount: 199.99,
    currency: 'USD',
    interval: 'month',
    startDate: '2023-03-05T00:00:00Z',
    nextBillingDate: '2023-06-05T00:00:00Z',
    createdAt: '2023-03-05T00:00:00Z'
  }
];

// Subscription plans
const plans = [
  {
    id: 'plan-001',
    name: 'Basic Plan',
    description: 'Essential features for small businesses',
    amount: 19.99,
    currency: 'USD',
    interval: 'month',
    features: [
      '100 transactions per month',
      'Email support',
      'Basic analytics',
      'Single user'
    ]
  },
  {
    id: 'plan-002',
    name: 'Premium Plan',
    description: 'Advanced features for growing businesses',
    amount: 49.99,
    currency: 'USD',
    interval: 'month',
    features: [
      'Unlimited transactions',
      'Priority email support',
      'Advanced analytics',
      'Up to 5 users',
      'API access'
    ]
  },
  {
    id: 'plan-003',
    name: 'Enterprise Plan',
    description: 'Complete solution for large organizations',
    amount: 199.99,
    currency: 'USD',
    interval: 'month',
    features: [
      'Unlimited transactions',
      'Dedicated support',
      'Real-time analytics',
      'Unlimited users',
      'Advanced API access',
      'Custom integrations',
      'SLA guarantees'
    ]
  }
];

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Subscription service is running' });
});

// Get all subscription plans
app.get('/api/plans', (req, res) => {
  res.status(200).json(plans);
});

// Get subscription plan by ID
app.get('/api/plans/:id', (req, res) => {
  const plan = plans.find(p => p.id === req.params.id);
  
  if (!plan) {
    return res.status(404).json({ message: 'Subscription plan not found' });
  }
  
  res.status(200).json(plan);
});

// Get all subscriptions
app.get('/api/subscriptions', (req, res) => {
  res.status(200).json(subscriptions);
});

// Get subscription by ID
app.get('/api/subscriptions/:id', (req, res) => {
  const subscription = subscriptions.find(s => s.id === req.params.id);
  
  if (!subscription) {
    return res.status(404).json({ message: 'Subscription not found' });
  }
  
  res.status(200).json(subscription);
});

// Create a new subscription
app.post('/api/subscriptions', (req, res) => {
  const { planId, customerId, customerName, customerEmail, paymentMethodId } = req.body;
  
  if (!planId || !customerId || !customerName || !customerEmail) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  const plan = plans.find(p => p.id === planId);
  if (!plan) {
    return res.status(404).json({ message: 'Subscription plan not found' });
  }
  
  const now = new Date();
  const nextMonthDate = new Date(now);
  nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
  
  const newSubscription = {
    id: `sub-${uuidv4().slice(0, 8)}`,
    name: plan.name,
    customerId,
    customerName,
    customerEmail,
    paymentMethodId,
    status: 'active',
    amount: plan.amount,
    currency: plan.currency,
    interval: plan.interval,
    startDate: now.toISOString(),
    nextBillingDate: nextMonthDate.toISOString(),
    createdAt: now.toISOString()
  };
  
  subscriptions.push(newSubscription);
  
  res.status(201).json(newSubscription);
});

// Cancel a subscription
app.post('/api/subscriptions/:id/cancel', (req, res) => {
  const subscription = subscriptions.find(s => s.id === req.params.id);
  
  if (!subscription) {
    return res.status(404).json({ message: 'Subscription not found' });
  }
  
  if (subscription.status !== 'active') {
    return res.status(400).json({ message: `Subscription is already ${subscription.status}` });
  }
  
  subscription.status = 'cancelled';
  subscription.cancelledAt = new Date().toISOString();
  
  res.status(200).json(subscription);
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
  console.log(`Subscription service running on port ${PORT}`);
});

module.exports = app; 