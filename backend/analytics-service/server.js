const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8084;

// Mock analytics data for demonstration
const transactionStats = {
  totalTransactions: 1245,
  totalSuccessful: 1189,
  totalFailed: 56,
  totalAmount: 124567.89,
  averageAmount: 100.05,
  conversionRate: 95.5,
  revenueByDay: [
    { date: '2023-05-01', amount: 4250.75 },
    { date: '2023-05-02', amount: 3890.25 },
    { date: '2023-05-03', amount: 4100.50 },
    { date: '2023-05-04', amount: 3950.00 },
    { date: '2023-05-05', amount: 4500.00 },
    { date: '2023-05-06', amount: 3200.50 },
    { date: '2023-05-07', amount: 2800.75 },
    { date: '2023-05-08', amount: 4150.25 },
    { date: '2023-05-09', amount: 4300.50 },
    { date: '2023-05-10', amount: 4050.00 },
    { date: '2023-05-11', amount: 4200.00 },
    { date: '2023-05-12', amount: 3950.50 },
    { date: '2023-05-13', amount: 3100.75 },
    { date: '2023-05-14', amount: 2900.25 },
    { date: '2023-05-15', amount: 4250.75 },
    { date: '2023-05-16', amount: 4350.25 },
    { date: '2023-05-17', amount: 4100.50 },
    { date: '2023-05-18', amount: 4200.00 },
    { date: '2023-05-19', amount: 4500.00 },
    { date: '2023-05-20', amount: 3800.50 },
    { date: '2023-05-21', amount: 3100.75 },
    { date: '2023-05-22', amount: 4150.25 },
    { date: '2023-05-23', amount: 4300.50 },
    { date: '2023-05-24', amount: 4050.00 },
    { date: '2023-05-25', amount: 4200.00 },
    { date: '2023-05-26', amount: 4150.50 },
    { date: '2023-05-27', amount: 3500.75 },
    { date: '2023-05-28', amount: 3200.25 },
    { date: '2023-05-29', amount: 4100.75 },
    { date: '2023-05-30', amount: 3950.25 }
  ],
  paymentMethods: [
    { method: 'credit_card', count: 875, amount: 87500.50 },
    { method: 'debit_card', count: 215, amount: 21500.25 },
    { method: 'bank_transfer', count: 78, amount: 7800.75 },
    { method: 'digital_wallet', count: 56, amount: 5600.50 },
    { method: 'other', count: 21, amount: 2100.25 }
  ],
  topCountries: [
    { country: 'US', transactions: 532, amount: 53200.50 },
    { country: 'UK', transactions: 215, amount: 21500.25 },
    { country: 'CA', transactions: 156, amount: 15600.75 },
    { country: 'AU', transactions: 98, amount: 9800.50 },
    { country: 'DE', transactions: 87, amount: 8700.25 }
  ]
};

const customerStats = {
  totalCustomers: 865,
  newCustomers: 125,
  returningCustomers: 740,
  avgTransactionsPerCustomer: 1.45,
  avgLifetimeValue: 255.75,
  customersByDay: [
    { date: '2023-05-01', new: 5, returning: 22 },
    { date: '2023-05-02', new: 4, returning: 25 },
    { date: '2023-05-03', new: 6, returning: 23 },
    { date: '2023-05-04', new: 3, returning: 24 },
    { date: '2023-05-05', new: 7, returning: 26 },
    { date: '2023-05-06', new: 2, returning: 18 },
    { date: '2023-05-07', new: 2, returning: 15 },
    { date: '2023-05-08', new: 5, returning: 24 },
    { date: '2023-05-09', new: 4, returning: 27 },
    { date: '2023-05-10', new: 6, returning: 25 },
    { date: '2023-05-11', new: 3, returning: 26 },
    { date: '2023-05-12', new: 7, returning: 24 },
    { date: '2023-05-13', new: 2, returning: 16 },
    { date: '2023-05-14', new: 2, returning: 14 },
    { date: '2023-05-15', new: 5, returning: 25 },
    { date: '2023-05-16', new: 4, returning: 28 },
    { date: '2023-05-17', new: 6, returning: 25 },
    { date: '2023-05-18', new: 3, returning: 26 },
    { date: '2023-05-19', new: 7, returning: 27 },
    { date: '2023-05-20', new: 2, returning: 20 },
    { date: '2023-05-21', new: 2, returning: 16 },
    { date: '2023-05-22', new: 5, returning: 24 },
    { date: '2023-05-23', new: 4, returning: 26 },
    { date: '2023-05-24', new: 6, returning: 25 },
    { date: '2023-05-25', new: 3, returning: 27 },
    { date: '2023-05-26', new: 7, returning: 24 },
    { date: '2023-05-27', new: 2, returning: 18 },
    { date: '2023-05-28', new: 2, returning: 15 },
    { date: '2023-05-29', new: 5, returning: 23 },
    { date: '2023-05-30', new: 4, returning: 22 }
  ],
  customerSegments: [
    { segment: 'one_time', count: 325, percentage: 37.57 },
    { segment: 'occasional', count: 275, percentage: 31.79 },
    { segment: 'regular', count: 165, percentage: 19.08 },
    { segment: 'loyal', count: 100, percentage: 11.56 }
  ]
};

const revenueStats = {
  totalRevenue: 142567.89,
  monthlyRevenue: 26750.50,
  yearlyRevenue: 321006.25,
  projectedRevenue: 350000.00,
  revenueGrowth: 15.5,
  averageOrderValue: 114.51,
  revenueByProduct: [
    { product: 'Product A', revenue: 58250.50, percentage: 40.86 },
    { product: 'Product B', revenue: 42750.25, percentage: 29.99 },
    { product: 'Product C', revenue: 24800.75, percentage: 17.40 },
    { product: 'Product D', revenue: 12500.25, percentage: 8.77 },
    { product: 'Other', revenue: 4266.14, percentage: 2.99 }
  ],
  revenueByMonth: [
    { month: 'Jan', revenue: 24500.75 },
    { month: 'Feb', revenue: 25100.25 },
    { month: 'Mar', revenue: 26750.50 },
    { month: 'Apr', revenue: 27500.00 },
    { month: 'May', revenue: 26750.50 },
    { month: 'Jun', revenue: 0 },
    { month: 'Jul', revenue: 0 },
    { month: 'Aug', revenue: 0 },
    { month: 'Sep', revenue: 0 },
    { month: 'Oct', revenue: 0 },
    { month: 'Nov', revenue: 0 },
    { month: 'Dec', revenue: 0 }
  ]
};

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Analytics service is running' });
});

// Get dashboard summary
app.get('/api/dashboard', (req, res) => {
  const dashboardData = {
    transactionCount: transactionStats.totalTransactions,
    successRate: (transactionStats.totalSuccessful / transactionStats.totalTransactions) * 100,
    totalRevenue: transactionStats.totalAmount,
    averageOrderValue: transactionStats.averageAmount,
    customerCount: customerStats.totalCustomers,
    newCustomers: customerStats.newCustomers,
    revenueGrowth: revenueStats.revenueGrowth,
    topPaymentMethod: transactionStats.paymentMethods[0].method,
    recentTransactions: transactionStats.revenueByDay.slice(-7),
    customerGrowth: customerStats.customersByDay.slice(-7),
    
    // Last 30 days graph data
    revenueTrend: transactionStats.revenueByDay,
    customerTrend: customerStats.customersByDay,
    
    // Distribution data
    paymentMethods: transactionStats.paymentMethods,
    customerSegments: customerStats.customerSegments,
    topCountries: transactionStats.topCountries
  };
  
  res.status(200).json(dashboardData);
});

// Get transaction statistics
app.get('/api/analytics/transactions', (req, res) => {
  res.status(200).json(transactionStats);
});

// Get customer statistics
app.get('/api/analytics/customers', (req, res) => {
  res.status(200).json(customerStats);
});

// Get revenue statistics
app.get('/api/analytics/revenue', (req, res) => {
  res.status(200).json(revenueStats);
});

// Get custom date range analytics
app.post('/api/analytics/custom', (req, res) => {
  const { startDate, endDate, metrics } = req.body;
  
  if (!startDate || !endDate) {
    return res.status(400).json({ message: 'Start date and end date are required' });
  }
  
  // Mock implementation - in a real app, this would query a database
  // Here we're just returning a subset of our pre-defined data
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Filter revenue by day within date range
  const filteredRevenue = transactionStats.revenueByDay.filter(item => {
    const date = new Date(item.date);
    return date >= start && date <= end;
  });
  
  // Filter customers by day within date range
  const filteredCustomers = customerStats.customersByDay.filter(item => {
    const date = new Date(item.date);
    return date >= start && date <= end;
  });
  
  // Calculate metrics for the date range
  const totalRevenue = filteredRevenue.reduce((sum, item) => sum + item.amount, 0);
  const totalNewCustomers = filteredCustomers.reduce((sum, item) => sum + item.new, 0);
  const totalReturningCustomers = filteredCustomers.reduce((sum, item) => sum + item.returning, 0);
  
  // Compose response based on requested metrics
  const result = {
    dateRange: { startDate, endDate },
    metrics: {
      totalRevenue,
      averageRevenue: totalRevenue / filteredRevenue.length,
      totalNewCustomers,
      totalReturningCustomers,
      revenueByDay: filteredRevenue,
      customersByDay: filteredCustomers
    }
  };
  
  res.status(200).json(result);
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
  console.log(`Analytics service running on port ${PORT}`);
});

module.exports = app; 