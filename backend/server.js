const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Load Swagger document
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Sample data (replace with database in production)
const mockData = {
  transactions: [
    { id: '1', customer: 'John Smith', date: '2024-03-10T10:00:00Z', amount: 120.50, status: 'completed', method: 'Credit Card' },
    { id: '2', customer: 'Sarah Johnson', date: '2024-03-10T09:30:00Z', amount: 85.25, status: 'completed', method: 'FPX' },
    { id: '3', customer: 'Michael Brown', date: '2024-03-09T15:20:00Z', amount: 220.00, status: 'pending', method: 'FPX' },
    { id: '4', customer: 'Emma Wilson', date: '2024-03-09T14:15:00Z', amount: 65.75, status: 'completed', method: 'Credit Card' },
    { id: '5', customer: 'James Davis', date: '2024-03-09T11:45:00Z', amount: 190.20, status: 'failed', method: 'E-Wallet' },
  ],
  paymentMethods: [
    { id: '1', name: 'Credit Card', type: 'card', percentage: 45 },
    { id: '2', name: 'FPX', type: 'bank', percentage: 25 },
    { id: '3', name: 'E-Wallet', type: 'wallet', percentage: 20 },
    { id: '4', name: 'Other', type: 'other', percentage: 10 },
  ],
  revenueData: {
    daily: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      amount: 3000 + Math.random() * 2000
    }))
  }
};

// API Routes
app.get('/api/dashboard', (req, res) => {
  const totalRevenue = mockData.transactions.reduce((sum, t) => sum + t.amount, 0);
  const completedTransactions = mockData.transactions.filter(t => t.status === 'completed');
  
  res.json({
    totalRevenue,
    transactionCount: mockData.transactions.length,
    averageSale: totalRevenue / completedTransactions.length,
    activeCustomers: new Set(mockData.transactions.map(t => t.customer)).size,
    revenueGrowth: 8.2,
    transactionGrowth: 12.3
  });
});

app.get('/api/transactions', (req, res) => {
  const { page = 1, limit = 10, status, startDate, endDate } = req.query;
  
  let filteredTransactions = [...mockData.transactions];
  
  if (status) {
    filteredTransactions = filteredTransactions.filter(t => t.status === status);
  }
  
  if (startDate) {
    filteredTransactions = filteredTransactions.filter(t => new Date(t.date) >= new Date(startDate));
  }
  
  if (endDate) {
    filteredTransactions = filteredTransactions.filter(t => new Date(t.date) <= new Date(endDate));
  }
  
  const start = (page - 1) * limit;
  const end = start + limit;
  
  res.json({
    data: filteredTransactions.slice(start, end),
    total: filteredTransactions.length,
    page: parseInt(page),
    totalPages: Math.ceil(filteredTransactions.length / limit)
  });
});

app.get('/api/payment-methods', (req, res) => {
  res.json(mockData.paymentMethods);
});

app.get('/api/revenue', (req, res) => {
  const { period = 'daily' } = req.query;
  const data = mockData.revenueData[period] || mockData.revenueData.daily;
  
  const total = data.reduce((sum, d) => sum + d.amount, 0);
  const growth = 15.5; // Mock growth rate
  
  res.json({
    data,
    total,
    growth
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
}); 