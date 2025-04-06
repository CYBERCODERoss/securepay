import React, { useState } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Chip, 
  Avatar,
  Paper,
  IconButton,
  Stack,
  Divider,
  useTheme
} from '@mui/material';
import { 
  ArrowUpward, 
  ArrowDownward, 
  MoreVert, 
  Visibility, 
  AttachMoney, 
  Payment, 
  Receipt, 
  TrendingUp, 
  Security, 
  CreditCard,
  ShoppingCart,
  Download
} from '@mui/icons-material';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement,
  Filler
);

// Sample transaction data
const transactionData = [
  { id: 1, customer: 'John Smith', date: '2023-06-01', amount: 120.50, status: 'completed', method: 'Credit Card' },
  { id: 2, customer: 'Sarah Johnson', date: '2023-06-01', amount: 85.25, status: 'completed', method: 'FPX' },
  { id: 3, customer: 'Michael Brown', date: '2023-05-31', amount: 220.00, status: 'pending', method: 'FPX' },
  { id: 4, customer: 'Emma Wilson', date: '2023-05-30', amount: 65.75, status: 'completed', method: 'Credit Card' },
  { id: 5, customer: 'James Davis', date: '2023-05-29', amount: 190.20, status: 'failed', method: 'FPX' },
];

// Chart data - Revenue
const revenueChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Monthly Revenue',
      data: [3000, 5500, 4900, 6500, 8500, 9000],
      borderColor: '#1976d2',
      backgroundColor: 'rgba(25, 118, 210, 0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#ffffff',
      pointBorderColor: '#1976d2',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
  ],
};

// Chart options - Revenue
const revenueChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: '#0f172a',
      bodyColor: '#475569',
      borderColor: 'rgba(0, 0, 0, 0.05)',
      borderWidth: 1,
      padding: 12,
      boxPadding: 6,
      usePointStyle: true,
      titleFont: {
        weight: 600,
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: '#64748b',
      }
    },
    y: {
      grid: {
        borderDash: [2],
        color: 'rgba(0, 0, 0, 0.05)',
      },
      ticks: {
        color: '#64748b',
      }
    },
  },
  interaction: {
    intersect: false,
    mode: 'index',
  },
};

// Chart data - Transactions
const transactionChartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Transactions',
      data: [18, 25, 20, 30, 40, 25, 15],
      backgroundColor: 'rgba(25, 118, 210, 0.8)',
      borderRadius: 6,
      barThickness: 12,
    },
  ],
};

// Chart options - Transactions
const transactionChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: '#0f172a',
      bodyColor: '#475569',
      borderColor: 'rgba(0, 0, 0, 0.05)',
      borderWidth: 1,
      padding: 12,
      usePointStyle: true,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: '#64748b',
      }
    },
    y: {
      grid: {
        borderDash: [2],
        color: 'rgba(0, 0, 0, 0.05)',
      },
      ticks: {
        color: '#64748b',
      }
    },
  },
};

// Chart data - Payment Methods
const paymentMethodsData = {
  labels: ['Credit Card', 'FPX', 'E-Wallet'],
  datasets: [
    {
      data: [55, 30, 15],
      backgroundColor: [
        'rgba(25, 118, 210, 0.8)',
        'rgba(46, 204, 113, 0.8)',
        'rgba(155, 89, 182, 0.8)',
      ],
      borderWidth: 0,
      borderRadius: 4,
    },
  ],
};

// Chart options - Payment Methods
const paymentMethodsOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: '#0f172a',
      bodyColor: '#475569',
      borderColor: 'rgba(0, 0, 0, 0.05)',
      borderWidth: 1,
      padding: 12,
      usePointStyle: true,
    },
  },
};

// Dashboard Component
const Dashboard = () => {
  const theme = useTheme();
  
  // Feature card component
  const FeatureCard = ({ icon, title, description, iconBg }) => (
    <Card className="feature-card">
      <CardContent>
        <Box className="icon-wrapper" sx={{ bgcolor: iconBg, color: 'white', mb: 2 }}>
          {icon}
        </Box>
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );

  // Stat card component
  const StatCard = ({ title, value, icon, change, trend, iconBg }) => (
    <Card className="dashboard-stat-card">
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5, fontWeight: 500 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {value}
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: iconBg, width: 48, height: 48 }}>
            {icon}
          </Avatar>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: trend === 'up' ? 'success.main' : 'error.main',
              bgcolor: trend === 'up' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)',
              borderRadius: 1,
              px: 1,
              py: 0.5,
              mr: 1,
            }}
          >
            {trend === 'up' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />}
            <Typography variant="body2" sx={{ fontWeight: 600, ml: 0.5 }}>
              {change}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            vs last month
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<Download />}
          sx={{ borderRadius: '50px', px: 3 }}
        >
          Download Report
        </Button>
      </Box>
      
      {/* Stats row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Revenue" 
            value="RM 24,532" 
            icon={<AttachMoney />} 
            change="12.5%" 
            trend="up"
            iconBg="linear-gradient(135deg, #1976d2 0%, #2196f3 100%)" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Transactions" 
            value="842" 
            icon={<Payment />} 
            change="8.2%" 
            trend="up"
            iconBg="linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Average Value" 
            value="RM 145.80" 
            icon={<TrendingUp />} 
            change="3.1%" 
            trend="up"
            iconBg="linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Pending Payments" 
            value="12" 
            icon={<Receipt />} 
            change="2.5%" 
            trend="down"
            iconBg="linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)" 
          />
        </Grid>
      </Grid>
      
      {/* Charts row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Revenue Overview
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small"
                  sx={{ 
                    borderRadius: '50px', 
                    borderColor: 'rgba(0,0,0,0.12)',
                    color: 'text.secondary',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'transparent'
                    }
                  }}
                >
                  Monthly
                </Button>
              </Box>
              <Box sx={{ height: 300, position: 'relative' }}>
                <Line data={revenueChartData} options={revenueChartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Payment Methods
                </Typography>
                <IconButton size="small">
                  <MoreVert fontSize="small" />
                </IconButton>
              </Box>
              <Box sx={{ height: 220, position: 'relative', mb: 2 }}>
                <Doughnut data={paymentMethodsData} options={paymentMethodsOptions} />
              </Box>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: 12, height: 12, bgcolor: 'rgba(25, 118, 210, 0.8)', borderRadius: '50%', mr: 1 }} />
                    <Typography variant="body2">Credit Card</Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={600}>55%</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: 12, height: 12, bgcolor: 'rgba(46, 204, 113, 0.8)', borderRadius: '50%', mr: 1 }} />
                    <Typography variant="body2">FPX</Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={600}>30%</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: 12, height: 12, bgcolor: 'rgba(155, 89, 182, 0.8)', borderRadius: '50%', mr: 1 }} />
                    <Typography variant="body2">E-Wallet</Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={600}>15%</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Recent Transactions */}
      <Card className="transaction-table" sx={{ mb: 4 }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Recent Transactions
            </Typography>
            <Button 
              variant="text" 
              sx={{ color: 'primary.main', fontWeight: 600 }}
              endIcon={<ArrowDownward fontSize="small" />}
            >
              View All
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Payment Method</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactionData.map((transaction) => (
                  <TableRow key={transaction.id} hover className="transaction-item">
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {transaction.customer}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {transaction.date}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        RM {transaction.amount.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={transaction.status}
                        size="small"
                        className={`status-chip status-${transaction.status}`}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {transaction.method}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small">
                        <Visibility fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      
      {/* Features section */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          SecurePay Features
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard 
              icon={<Security />} 
              title="World Class Security" 
              description="We keep all your financial information securely encrypted and protected with 24/7 security monitoring."
              iconBg="linear-gradient(135deg, #1976d2 0%, #2196f3 100%)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard 
              icon={<ShoppingCart />} 
              title="Shop Catalog" 
              description="Create catalogs for your customers easily and fast. Share your personal catalog link with customers."
              iconBg="linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard 
              icon={<CreditCard />} 
              title="Multiple Payment Methods" 
              description="Accept payments using FPX online banking, credit cards, and various e-wallets."
              iconBg="linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard 
              icon={<TrendingUp />} 
              title="Reporting Dashboard" 
              description="Track your sales and collection performance in real-time with detailed analytics."
              iconBg="linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)"
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard; 