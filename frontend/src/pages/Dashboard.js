import React, { useState, useEffect } from 'react';
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
  useTheme,
  CircularProgress
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
import { Line, Bar, Doughnut, Scatter } from 'react-chartjs-2';
import { getDashboardStats, getTransactions, getPaymentMethods, getRevenueData } from '../services/api';

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

// Enhanced Revenue Chart Data
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
    {
      label: 'Projected Revenue',
      data: [3200, 5700, 5100, 6800, 8800, 9500],
      borderColor: 'rgba(46, 204, 113, 0.8)',
      backgroundColor: 'rgba(46, 204, 113, 0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#ffffff',
      pointBorderColor: 'rgba(46, 204, 113, 0.8)',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    }
  ],
};

// Add these styles at the top level of the component
const styles = {
  card3D: {
    transform: 'perspective(1000px) rotateX(5deg)',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'perspective(1000px) rotateX(0deg) translateY(-5px)',
    },
    boxShadow: '0 10px 20px rgba(0,0,0,0.1), 0 6px 6px rgba(0,0,0,0.1)',
  },
  chartContainer: {
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
      borderRadius: '8px',
      pointerEvents: 'none',
    }
  }
};

// Enhanced Revenue Chart Options with 3D effect
const revenueChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        boxWidth: 12,
        usePointStyle: true,
        padding: 20,
      }
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
      callbacks: {
        label: function(context) {
          return ` ${context.dataset.label}: RM ${context.parsed.y}`;
        }
      }
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: '#64748b',
        font: {
          weight: 500
        }
      }
    },
    y: {
      grid: {
        borderDash: [2],
        color: 'rgba(0, 0, 0, 0.05)',
      },
      ticks: {
        color: '#64748b',
        font: {
          weight: 500
        },
        callback: function(value) {
          return 'RM ' + value;
        }
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

// Enhanced Payment Methods Chart with 3D effect
const paymentMethodsData = {
  labels: ['Credit Card', 'FPX', 'E-Wallet', 'Other'],
  datasets: [
    {
      data: [45, 25, 20, 10],
      backgroundColor: [
        'rgba(25, 118, 210, 0.8)',
        'rgba(46, 204, 113, 0.8)',
        'rgba(155, 89, 182, 0.8)',
        'rgba(241, 196, 15, 0.8)',
      ],
      borderWidth: 0,
      borderRadius: 4,
      offset: 20,
    },
  ],
};

const paymentMethodsOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '60%',
  plugins: {
    legend: {
      display: true,
      position: 'right',
      labels: {
        padding: 20,
        usePointStyle: true,
      }
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
  layout: {
    padding: 20
  },
  animation: {
    animateRotate: true,
    animateScale: true
  }
};

// Add new Fraud Analytics Chart
const fraudChartData = {
  labels: ['Low Risk', 'Medium Risk', 'High Risk'],
  datasets: [
    {
      data: [65, 25, 10],
      backgroundColor: [
        'rgba(46, 204, 113, 0.8)',
        'rgba(241, 196, 15, 0.8)',
        'rgba(231, 76, 60, 0.8)',
      ],
      borderWidth: 0,
      borderRadius: 4,
    },
  ],
};

const fraudChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
    },
    title: {
      display: true,
      text: 'Risk Assessment Distribution',
      padding: {
        top: 10,
        bottom: 20
      }
    }
  },
};

// Dashboard Component
const Dashboard = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    transactionCount: 0,
    averageSale: 0,
    activeCustomers: 0,
    revenueGrowth: 0,
    transactionGrowth: 0
  });
  const [transactions, setTransactions] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [revenueData, setRevenueData] = useState({ data: [], total: 0, growth: 0 });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [stats, transData, methodsData, revData] = await Promise.all([
          getDashboardStats(),
          getTransactions({ limit: 5 }),
          getPaymentMethods(),
          getRevenueData('daily')
        ]);

        setDashboardData(stats);
        setTransactions(transData.data);
        setPaymentMethods(methodsData);
        setRevenueData(revData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" variant="h6">{error}</Typography>
        <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  // Update the data for charts
  const updatedRevenueChartData = {
    ...revenueChartData,
    datasets: [
      {
        ...revenueChartData.datasets[0],
        data: revenueData.data.map(item => item.amount)
      }
    ]
  };

  const updatedPaymentMethodsData = {
    labels: paymentMethods.map(method => method.name),
    datasets: [{
      data: paymentMethods.map(method => method.percentage),
      backgroundColor: [
        'rgba(25, 118, 210, 0.8)',
        'rgba(46, 204, 113, 0.8)',
        'rgba(155, 89, 182, 0.8)',
        'rgba(241, 196, 15, 0.8)',
      ],
      borderWidth: 0,
      borderRadius: 4,
      offset: 20,
    }],
  };

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
    <Card 
      className="dashboard-stat-card"
      sx={{ 
        p: 3,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        ...styles.card3D
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5, fontWeight: 500 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {value}
            </Typography>
          </Box>
          <Avatar 
            sx={{ 
              bgcolor: iconBg, 
              width: 48, 
              height: 48,
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              transform: 'translateZ(20px)'
            }}
          >
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
            value={`RM ${dashboardData.totalRevenue.toFixed(2)}`}
            icon={<AttachMoney />} 
            change={`${dashboardData.revenueGrowth}%`}
            trend="up"
            iconBg="linear-gradient(135deg, #1976d2 0%, #2196f3 100%)" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Transactions" 
            value={dashboardData.transactionCount.toString()}
            icon={<Payment />} 
            change={`${dashboardData.transactionGrowth}%`}
            trend="up"
            iconBg="linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Average Value" 
            value={`RM ${dashboardData.averageSale.toFixed(2)}`}
            icon={<TrendingUp />} 
            change="3.1%" 
            trend="up"
            iconBg="linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Active Customers" 
            value={dashboardData.activeCustomers.toString()}
            icon={<Receipt />} 
            change="5.2%" 
            trend="up"
            iconBg="linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)" 
          />
        </Grid>
      </Grid>
      
      {/* Charts row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ ...styles.card3D }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Revenue Overview
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button 
                    variant="outlined" 
                    size="small"
                    sx={{ 
                      borderRadius: '50px', 
                      borderColor: 'rgba(0,0,0,0.12)',
                      color: 'text.secondary',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'transparent',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    Monthly
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="small"
                    sx={{ 
                      borderRadius: '50px', 
                      borderColor: 'rgba(0,0,0,0.12)',
                      color: 'text.secondary',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'transparent',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    Export
                  </Button>
                </Box>
              </Box>
              <Box sx={{ ...styles.chartContainer, height: 300, position: 'relative' }}>
                <Line data={updatedRevenueChartData} options={revenueChartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ ...styles.card3D }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Payment Methods
                </Typography>
                <IconButton 
                  size="small"
                  sx={{ 
                    '&:hover': { 
                      transform: 'rotate(180deg)',
                      transition: 'transform 0.3s ease-in-out'
                    }
                  }}
                >
                  <MoreVert fontSize="small" />
                </IconButton>
              </Box>
              <Box sx={{ ...styles.chartContainer, height: 300, position: 'relative' }}>
                <Doughnut data={updatedPaymentMethodsData} options={paymentMethodsOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* New Analytics Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Fraud Risk Analysis
                </Typography>
              </Box>
              <Box sx={{ height: 250, position: 'relative' }}>
                <Doughnut data={fraudChartData} options={fraudChartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Customer Growth
                </Typography>
              </Box>
              <Box sx={{ height: 250, position: 'relative' }}>
                <Bar 
                  data={{
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                      label: 'New Customers',
                      data: [65, 75, 85, 95, 110, 125],
                      backgroundColor: 'rgba(75, 192, 192, 0.8)',
                      borderRadius: 6,
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }}
                />
              </Box>
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
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id} hover className="transaction-item">
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {transaction.customer}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(transaction.date).toLocaleDateString()}
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