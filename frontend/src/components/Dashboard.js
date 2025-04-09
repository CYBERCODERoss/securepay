import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Payment as PaymentIcon,
  Subscriptions as SubscriptionIcon,
  Analytics as AnalyticsIcon,
  Notifications as NotificationIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { analyticsService, paymentService, subscriptionService } from '../services/api';

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalAmount: 0,
    averageAmount: 0,
    successRate: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analytics, payments, subscriptions] = await Promise.all([
          analyticsService.getTransactionAnalytics(),
          paymentService.getPayments(),
          subscriptionService.getSubscriptions(),
        ]);

        setStats({
          ...analytics.data,
          totalPayments: payments.data.length,
          totalSubscriptions: subscriptions.data.length,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <Grid item xs={12} sm={6} md={3}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100%',
          backgroundColor: color,
          color: 'white',
        }}
      >
        {icon}
        <Typography variant="h6" sx={{ mt: 2 }}>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ mt: 1 }}>
          {loading ? <CircularProgress size={24} /> : value}
        </Typography>
      </Paper>
    </Grid>
  );

  return (
    <Box sx={{ p: isMobile ? 2 : 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <StatCard
          title="Total Transactions"
          value={stats.totalTransactions}
          icon={<PaymentIcon sx={{ fontSize: 40 }} />}
          color={theme.palette.primary.main}
        />
        <StatCard
          title="Total Amount"
          value={`$${stats.totalAmount.toLocaleString()}`}
          icon={<AnalyticsIcon sx={{ fontSize: 40 }} />}
          color={theme.palette.secondary.main}
        />
        <StatCard
          title="Average Amount"
          value={`$${stats.averageAmount.toLocaleString()}`}
          icon={<SubscriptionIcon sx={{ fontSize: 40 }} />}
          color={theme.palette.success.main}
        />
        <StatCard
          title="Success Rate"
          value={`${stats.successRate}%`}
          icon={<SecurityIcon sx={{ fontSize: 40 }} />}
          color={theme.palette.info.main}
        />
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Recent Transactions
            </Typography>
            {/* Add transaction list component here */}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Active Subscriptions
            </Typography>
            {/* Add subscription list component here */}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 