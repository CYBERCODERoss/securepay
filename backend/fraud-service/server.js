const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 8086;

// Mock fraud detection data for demonstration
const fraudRules = [
  {
    id: 'rule-001',
    name: 'High Amount Transactions',
    description: 'Flag transactions over $1,000',
    status: 'active',
    conditions: {
      amount: { operator: 'gt', value: 1000 }
    },
    action: 'review',
    createdAt: '2023-01-10T00:00:00Z'
  },
  {
    id: 'rule-002',
    name: 'Multiple Transactions',
    description: 'Flag multiple transactions from the same card in a short time',
    status: 'active',
    conditions: {
      frequency: { operator: 'gt', value: 3, timeWindow: '5m' }
    },
    action: 'review',
    createdAt: '2023-01-15T00:00:00Z'
  },
  {
    id: 'rule-003',
    name: 'Unusual Location',
    description: 'Flag transactions from unexpected countries',
    status: 'active',
    conditions: {
      location: { operator: 'not_in', value: ['US', 'CA', 'UK', 'EU'] }
    },
    action: 'block',
    createdAt: '2023-02-05T00:00:00Z'
  }
];

const fraudAlerts = [
  {
    id: 'alert-001',
    transactionId: 'txn-123456',
    customerId: 'cus-001',
    ruleId: 'rule-001',
    ruleName: 'High Amount Transactions',
    amount: 1500.00,
    status: 'pending_review',
    createdAt: '2023-05-15T10:25:30Z'
  },
  {
    id: 'alert-002',
    transactionId: 'txn-789012',
    customerId: 'cus-002',
    ruleId: 'rule-003',
    ruleName: 'Unusual Location',
    country: 'RU',
    status: 'blocked',
    createdAt: '2023-05-16T15:45:22Z'
  },
  {
    id: 'alert-003',
    transactionId: 'txn-345678',
    customerId: 'cus-003',
    ruleId: 'rule-002',
    ruleName: 'Multiple Transactions',
    frequency: 5,
    timeWindow: '3m',
    status: 'pending_review',
    createdAt: '2023-05-17T08:12:15Z'
  }
];

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Fraud detection service is running' });
});

// Get all fraud rules
app.get('/api/rules', (req, res) => {
  res.status(200).json(fraudRules);
});

// Get fraud rule by ID
app.get('/api/rules/:id', (req, res) => {
  const rule = fraudRules.find(r => r.id === req.params.id);
  
  if (!rule) {
    return res.status(404).json({ message: 'Fraud rule not found' });
  }
  
  res.status(200).json(rule);
});

// Create a new fraud rule
app.post('/api/rules', (req, res) => {
  const { name, description, conditions, action } = req.body;
  
  if (!name || !conditions || !action) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  const newRule = {
    id: `rule-${uuidv4().slice(0, 8)}`,
    name,
    description,
    status: 'active',
    conditions,
    action,
    createdAt: new Date().toISOString()
  };
  
  fraudRules.push(newRule);
  
  res.status(201).json(newRule);
});

// Update a fraud rule
app.put('/api/rules/:id', (req, res) => {
  const ruleIndex = fraudRules.findIndex(r => r.id === req.params.id);
  
  if (ruleIndex === -1) {
    return res.status(404).json({ message: 'Fraud rule not found' });
  }
  
  const updatedRule = {
    ...fraudRules[ruleIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  fraudRules[ruleIndex] = updatedRule;
  
  res.status(200).json(updatedRule);
});

// Get all fraud alerts
app.get('/api/alerts', (req, res) => {
  res.status(200).json(fraudAlerts);
});

// Get fraud alert by ID
app.get('/api/alerts/:id', (req, res) => {
  const alert = fraudAlerts.find(a => a.id === req.params.id);
  
  if (!alert) {
    return res.status(404).json({ message: 'Fraud alert not found' });
  }
  
  res.status(200).json(alert);
});

// Check a transaction for fraud
app.post('/api/analyze', (req, res) => {
  const { transactionId, customerId, amount, country, cardDetails } = req.body;
  
  if (!transactionId || !customerId || !amount) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  // Simple fraud analysis logic for demonstration
  let flaggedRules = [];
  
  // Check high amount rule
  if (amount > 1000) {
    flaggedRules.push(fraudRules[0]); // High Amount Transactions rule
  }
  
  // Check location rule
  if (country && !['US', 'CA', 'UK', 'EU'].includes(country)) {
    flaggedRules.push(fraudRules[2]); // Unusual Location rule
  }
  
  // Generate result
  const result = {
    transactionId,
    customerId,
    amount,
    country,
    flagged: flaggedRules.length > 0,
    risk: flaggedRules.length > 0 ? (
      flaggedRules.some(r => r.action === 'block') ? 'high' : 'medium'
    ) : 'low',
    action: flaggedRules.some(r => r.action === 'block') ? 'block' : (
      flaggedRules.length > 0 ? 'review' : 'approve'
    ),
    flaggedRules: flaggedRules.map(r => ({
      id: r.id,
      name: r.name,
      action: r.action
    })),
    timestamp: new Date().toISOString()
  };
  
  // If fraud detected, create an alert
  if (result.flagged) {
    const primaryRule = flaggedRules[0];
    const alert = {
      id: `alert-${uuidv4().slice(0, 8)}`,
      transactionId,
      customerId,
      ruleId: primaryRule.id,
      ruleName: primaryRule.name,
      amount,
      country,
      status: primaryRule.action === 'block' ? 'blocked' : 'pending_review',
      createdAt: result.timestamp
    };
    
    fraudAlerts.push(alert);
    result.alertId = alert.id;
  }
  
  res.status(200).json(result);
});

// Resolve a fraud alert
app.post('/api/alerts/:id/resolve', (req, res) => {
  const { action, notes } = req.body;
  
  if (!action || !['approve', 'reject'].includes(action)) {
    return res.status(400).json({ message: 'Valid action (approve/reject) is required' });
  }
  
  const alertIndex = fraudAlerts.findIndex(a => a.id === req.params.id);
  
  if (alertIndex === -1) {
    return res.status(404).json({ message: 'Fraud alert not found' });
  }
  
  const resolvedAlert = {
    ...fraudAlerts[alertIndex],
    status: action === 'approve' ? 'approved' : 'rejected',
    notes,
    resolvedAt: new Date().toISOString()
  };
  
  fraudAlerts[alertIndex] = resolvedAlert;
  
  res.status(200).json(resolvedAlert);
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
  console.log(`Fraud detection service running on port ${PORT}`);
});

module.exports = app; 