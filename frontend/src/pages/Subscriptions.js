import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Chip, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle,
  useTheme,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import { 
  Add as AddIcon,
  Receipt as ReceiptIcon,
  Edit as EditIcon,
  Cancel as CancelIcon,
  CreditCard as CreditCardIcon,
  Refresh as RefreshIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';

// Mock data - would be replaced with actual API calls
const mockPlans = [
  {
    id: 'plan_1',
    name: 'Basic',
    description: 'Essential features for small businesses',
    amount: 29.99,
    currency: 'USD',
    interval: 'monthly',
    features: ['Payment processing', 'Basic analytics', 'Email support']
  },
  {
    id: 'plan_2',
    name: 'Professional',
    description: 'Advanced features for growing businesses',
    amount: 99.99,
    currency: 'USD',
    interval: 'monthly',
    features: ['All Basic features', 'Advanced analytics', 'Priority support', 'Custom payment pages']
  },
  {
    id: 'plan_3',
    name: 'Enterprise',
    description: 'Complete solution for large businesses',
    amount: 299.99,
    currency: 'USD',
    interval: 'monthly',
    features: ['All Professional features', 'Dedicated account manager', 'Custom integrations', 'Fraud protection', 'Multi-currency support']
  }
];

const mockSubscriptions = [
  {
    id: 'sub_1',
    planId: 'plan_2',
    planName: 'Professional',
    status: 'active',
    currentPeriodStart: '2023-08-01',
    currentPeriodEnd: '2023-09-01',
    amount: 99.99,
    currency: 'USD'
  },
  {
    id: 'sub_2',
    planId: 'plan_1',
    planName: 'Basic',
    status: 'canceled',
    currentPeriodStart: '2023-07-01',
    currentPeriodEnd: '2023-08-01',
    canceledAt: '2023-07-15',
    amount: 29.99,
    currency: 'USD'
  }
];

const Subscriptions = () => {
  const theme = useTheme();
  const [subscriptions, setSubscriptions] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [openSubscribeDialog, setOpenSubscribeDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPlans(mockPlans);
      setSubscriptions(mockSubscriptions);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCancelSubscription = (subscription) => {
    setSelectedSubscription(subscription);
    setOpenDialog(true);
  };

  const confirmCancelSubscription = () => {
    // In a real app, this would make an API call
    const updatedSubscriptions = subscriptions.map(sub => 
      sub.id === selectedSubscription.id 
        ? { ...sub, status: 'canceled', canceledAt: new Date().toISOString().split('T')[0] }
        : sub
    );
    setSubscriptions(updatedSubscriptions);
    setOpenDialog(false);
  };

  const handleSubscribeToPlan = () => {
    // In a real app, this would make an API call
    const selectedPlanDetails = plans.find(plan => plan.id === selectedPlan);
    if (selectedPlanDetails) {
      const newSubscription = {
        id: `sub_${Math.random().toString(36).substr(2, 9)}`,
        planId: selectedPlanDetails.id,
        planName: selectedPlanDetails.name,
        status: 'active',
        currentPeriodStart: new Date().toISOString().split('T')[0],
        currentPeriodEnd: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
        amount: selectedPlanDetails.amount,
        currency: selectedPlanDetails.currency
      };
      setSubscriptions([...subscriptions, newSubscription]);
      setOpenSubscribeDialog(false);
      setSelectedPlan('');
    }
  };

  const getStatusChipColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'canceled':
        return 'error';
      case 'suspended':
        return 'warning';
      case 'trial':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Subscriptions
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => setOpenSubscribeDialog(true)}
        >
          Subscribe to Plan
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Subscriptions
              </Typography>
              {subscriptions.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Plan</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Current Period</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {subscriptions.map((subscription) => (
                        <TableRow key={subscription.id}>
                          <TableCell>{subscription.planName}</TableCell>
                          <TableCell>
                            <Chip 
                              label={subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)} 
                              color={getStatusChipColor(subscription.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {subscription.currentPeriodStart} to {subscription.currentPeriodEnd}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(subscription.amount, subscription.currency)}/{subscription.interval || 'month'}
                          </TableCell>
                          <TableCell>
                            <Box display="flex">
                              <Button 
                                size="small" 
                                startIcon={<ReceiptIcon />} 
                                sx={{ mr: 1 }}
                              >
                                Invoices
                              </Button>
                              {subscription.status === 'active' && (
                                <Button 
                                  size="small" 
                                  color="error" 
                                  startIcon={<CancelIcon />}
                                  onClick={() => handleCancelSubscription(subscription)}
                                >
                                  Cancel
                                </Button>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box textAlign="center" py={3}>
                  <Typography variant="body1" color="textSecondary" gutterBottom>
                    You don't have any subscriptions yet.
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<AddIcon />}
                    onClick={() => setOpenSubscribeDialog(true)}
                    sx={{ mt: 2 }}
                  >
                    Subscribe to a Plan
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Available Plans
              </Typography>
              <Grid container spacing={3}>
                {plans.map((plan) => (
                  <Grid item xs={12} md={4} key={plan.id}>
                    <Card variant="outlined" sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      ...(plan.name === 'Professional' && {
                        border: `2px solid ${theme.palette.primary.main}`,
                      })
                    }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        {plan.name === 'Professional' && (
                          <Chip 
                            label="Most Popular" 
                            color="primary" 
                            size="small" 
                            sx={{ mb: 2 }}
                          />
                        )}
                        <Typography variant="h5" component="h2" gutterBottom>
                          {plan.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          {plan.description}
                        </Typography>
                        <Typography variant="h4" component="p" sx={{ my: 2 }}>
                          {formatCurrency(plan.amount, plan.currency)}
                          <Typography variant="caption" component="span">
                            /{plan.interval}
                          </Typography>
                        </Typography>
                        <Box mt={2}>
                          {plan.features.map((feature, index) => (
                            <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                              • {feature}
                            </Typography>
                          ))}
                        </Box>
                      </CardContent>
                      <Box p={2} pt={0}>
                        <Button 
                          variant={plan.name === 'Professional' ? "contained" : "outlined"} 
                          color="primary" 
                          fullWidth
                          onClick={() => {
                            setSelectedPlan(plan.id);
                            setOpenSubscribeDialog(true);
                          }}
                        >
                          Subscribe
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Cancel Subscription Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Cancel Subscription</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel your {selectedSubscription?.planName} subscription? 
            You will still have access until the end of your current billing period on {selectedSubscription?.currentPeriodEnd}.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Keep Subscription
          </Button>
          <Button onClick={confirmCancelSubscription} color="error">
            Cancel Subscription
          </Button>
        </DialogActions>
      </Dialog>

      {/* Subscribe to Plan Dialog */}
      <Dialog
        open={openSubscribeDialog}
        onClose={() => setOpenSubscribeDialog(false)}
      >
        <DialogTitle>Subscribe to Plan</DialogTitle>
        <DialogContent>
          <DialogContentText gutterBottom>
            Choose a plan to subscribe to:
          </DialogContentText>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="plan-select-label">Plan</InputLabel>
            <Select
              labelId="plan-select-label"
              id="plan-select"
              value={selectedPlan}
              label="Plan"
              onChange={(e) => setSelectedPlan(e.target.value)}
            >
              {plans.map((plan) => (
                <MenuItem key={plan.id} value={plan.id}>
                  {plan.name} - {formatCurrency(plan.amount, plan.currency)}/{plan.interval}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSubscribeDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubscribeToPlan} 
            color="primary" 
            variant="contained"
            disabled={!selectedPlan}
          >
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Subscriptions; 