const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 8082;

// Mock payment data for demonstration
const payments = [
  {
    id: 'pmt-001',
    amount: 125.50,
    currency: 'USD',
    status: 'completed',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    paymentMethod: 'credit_card',
    cardLast4: '4242',
    createdAt: '2023-05-15T10:30:00Z'
  },
  {
    id: 'pmt-002',
    amount: 75.25,
    currency: 'USD',
    status: 'completed',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    paymentMethod: 'credit_card',
    cardLast4: '1234',
    createdAt: '2023-05-16T14:20:00Z'
  },
  {
    id: 'pmt-003',
    amount: 200.00,
    currency: 'USD',
    status: 'pending',
    customerName: 'Alice Johnson',
    customerEmail: 'alice@example.com',
    paymentMethod: 'bank_transfer',
    createdAt: '2023-05-17T09:15:00Z'
  }
];

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Payment service is running' });
});

// Get all payments
app.get('/api/payments', (req, res) => {
  res.status(200).json(payments);
});

// Get payment by ID
app.get('/api/payments/:id', (req, res) => {
  const payment = payments.find(p => p.id === req.params.id);
  
  if (!payment) {
    return res.status(404).json({ message: 'Payment not found' });
  }
  
  res.status(200).json(payment);
});

// Create a new payment
app.post('/api/payments', (req, res) => {
  const { amount, currency, customerName, customerEmail, paymentMethod } = req.body;
  
  if (!amount || !currency || !customerName || !customerEmail || !paymentMethod) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  const newPayment = {
    id: `pmt-${uuidv4()}`,
    amount: parseFloat(amount),
    currency,
    status: 'pending',
    customerName,
    customerEmail,
    paymentMethod,
    ...(paymentMethod === 'credit_card' && { cardLast4: req.body.cardLast4 || '4242' }),
    createdAt: new Date().toISOString()
  };
  
  // Simulate payment processing
  setTimeout(() => {
    newPayment.status = Math.random() > 0.1 ? 'completed' : 'failed';
    
    if (newPayment.status === 'completed') {
      newPayment.completedAt = new Date().toISOString();
    } else {
      newPayment.failedAt = new Date().toISOString();
      newPayment.failureReason = 'Payment declined by issuer';
    }
  }, 2000);
  
  // Add to payments array
  payments.push(newPayment);
  
  res.status(201).json(newPayment);
});

// Cancel a payment
app.post('/api/payments/:id/cancel', (req, res) => {
  const payment = payments.find(p => p.id === req.params.id);
  
  if (!payment) {
    return res.status(404).json({ message: 'Payment not found' });
  }
  
  if (payment.status !== 'pending') {
    return res.status(400).json({ message: `Payment cannot be cancelled in ${payment.status} status` });
  }
  
  payment.status = 'cancelled';
  payment.cancelledAt = new Date().toISOString();
  
  res.status(200).json(payment);
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
  console.log(`Payment service running on port ${PORT}`);
});

module.exports = app; 