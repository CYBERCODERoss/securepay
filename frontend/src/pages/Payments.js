import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  TextField, 
  Button, 
  Stepper, 
  Step, 
  StepLabel, 
  InputAdornment,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { 
  CreditCard as CreditCardIcon, 
  AccountBalance as BankIcon,
  Payment as PayPalIcon,
  Apple as AppleIcon
} from '@mui/icons-material';

// Steps for payment process
const steps = ['Payment Information', 'Review', 'Confirmation'];

const PaymentMethodCard = ({ icon, label, value, selected, onChange }) => {
  return (
    <Paper 
      className={`payment-method-card ${selected ? 'selected' : ''}`}
      elevation={0}
      onClick={() => onChange(value)}
    >
      <Box display="flex" alignItems="center">
        <Radio 
          checked={selected} 
          onChange={() => onChange(value)} 
          value={value} 
          name="payment-method-radio" 
          color="primary"
        />
        <Box display="flex" alignItems="center" ml={1}>
          {icon}
          <Typography variant="subtitle1" ml={1}>{label}</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

const CreditCardForm = ({ formik }) => {
  const [cardFocus, setCardFocus] = useState('');
  
  const cards = [
    { id: 'visa', name: 'Visa' },
    { id: 'mastercard', name: 'Mastercard' },
    { id: 'amex', name: 'American Express' },
    { id: 'discover', name: 'Discover' },
  ];
  
  return (
    <Grid container spacing={3}>
      {/* Credit Card Preview */}
      <Grid item xs={12} md={6} sx={{ mb: { xs: 2, md: 0 } }}>
        <Box className="credit-card">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" component="div" fontWeight="bold">
              SecurePay
            </Typography>
          </Box>
          
          <Typography 
            variant="body2" 
            color="rgba(255, 255, 255, 0.7)" 
            sx={{ mb: 0.5 }}
          >
            Card Number
          </Typography>
          
          <Typography 
            variant="h6" 
            fontWeight="medium" 
            letterSpacing={1}
            sx={{ 
              mb: 2,
              color: cardFocus === 'cardNumber' ? 'white' : 'rgba(255, 255, 255, 0.9)'
            }}
          >
            {formik.values.cardNumber 
              ? formik.values.cardNumber.replace(/(\d{4})/g, '$1 ').trim() 
              : '•••• •••• •••• ••••'}
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography 
                variant="body2" 
                color="rgba(255, 255, 255, 0.7)" 
                sx={{ mb: 0.5 }}
              >
                Card Holder
              </Typography>
              
              <Typography 
                variant="body1" 
                fontWeight="medium"
                sx={{ 
                  textTransform: 'uppercase',
                  color: cardFocus === 'cardName' ? 'white' : 'rgba(255, 255, 255, 0.9)'
                }}
              >
                {formik.values.cardName || 'YOUR NAME'}
              </Typography>
            </Grid>
            
            <Grid item xs={6}>
              <Typography 
                variant="body2" 
                color="rgba(255, 255, 255, 0.7)" 
                sx={{ mb: 0.5 }}
              >
                Expiry
              </Typography>
              
              <Typography 
                variant="body1" 
                fontWeight="medium"
                sx={{ 
                  color: (cardFocus === 'expiryMonth' || cardFocus === 'expiryYear') 
                    ? 'white' 
                    : 'rgba(255, 255, 255, 0.9)'
                }}
              >
                {formik.values.expiryMonth 
                  ? `${formik.values.expiryMonth.padStart(2, '0')}/${formik.values.expiryYear}` 
                  : 'MM/YY'}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Grid>
      
      {/* Credit Card Form */}
      <Grid item xs={12} md={6}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="cardNumber"
              name="cardNumber"
              label="Card Number"
              variant="outlined"
              placeholder="1234 5678 9012 3456"
              value={formik.values.cardNumber}
              onChange={formik.handleChange}
              onFocus={() => setCardFocus('cardNumber')}
              onBlur={(e) => {
                setCardFocus('');
                formik.handleBlur(e);
              }}
              error={formik.touched.cardNumber && Boolean(formik.errors.cardNumber)}
              helperText={formik.touched.cardNumber && formik.errors.cardNumber}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CreditCardIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="cardName"
              name="cardName"
              label="Cardholder Name"
              variant="outlined"
              placeholder="John Doe"
              value={formik.values.cardName}
              onChange={formik.handleChange}
              onFocus={() => setCardFocus('cardName')}
              onBlur={(e) => {
                setCardFocus('');
                formik.handleBlur(e);
              }}
              error={formik.touched.cardName && Boolean(formik.errors.cardName)}
              helperText={formik.touched.cardName && formik.errors.cardName}
            />
          </Grid>
          
          <Grid item xs={6}>
            <TextField
              fullWidth
              id="expiryMonth"
              name="expiryMonth"
              label="Month (MM)"
              variant="outlined"
              placeholder="MM"
              value={formik.values.expiryMonth}
              onChange={formik.handleChange}
              onFocus={() => setCardFocus('expiryMonth')}
              onBlur={(e) => {
                setCardFocus('');
                formik.handleBlur(e);
              }}
              error={formik.touched.expiryMonth && Boolean(formik.errors.expiryMonth)}
              helperText={formik.touched.expiryMonth && formik.errors.expiryMonth}
            />
          </Grid>
          
          <Grid item xs={6}>
            <TextField
              fullWidth
              id="expiryYear"
              name="expiryYear"
              label="Year (YY)"
              variant="outlined"
              placeholder="YY"
              value={formik.values.expiryYear}
              onChange={formik.handleChange}
              onFocus={() => setCardFocus('expiryYear')}
              onBlur={(e) => {
                setCardFocus('');
                formik.handleBlur(e);
              }}
              error={formik.touched.expiryYear && Boolean(formik.errors.expiryYear)}
              helperText={formik.touched.expiryYear && formik.errors.expiryYear}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="cvv"
              name="cvv"
              label="CVV"
              variant="outlined"
              placeholder="123"
              type="password"
              value={formik.values.cvv}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.cvv && Boolean(formik.errors.cvv)}
              helperText={formik.touched.cvv && formik.errors.cvv}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

const Payments = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const formik = useFormik({
    initialValues: {
      amount: '',
      currency: 'USD',
      description: '',
      cardNumber: '',
      cardName: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
    },
    validationSchema: Yup.object({
      amount: Yup.number()
        .positive('Amount must be positive')
        .required('Amount is required'),
      description: Yup.string()
        .max(100, 'Description must be 100 characters or less'),
      cardNumber: Yup.string()
        .when('$paymentMethod', {
          is: 'credit-card',
          then: () => Yup.string()
            .required('Card number is required')
            .matches(/^[0-9]{16}$/, 'Card number must be 16 digits'),
        }),
      cardName: Yup.string()
        .when('$paymentMethod', {
          is: 'credit-card',
          then: () => Yup.string().required('Cardholder name is required'),
        }),
      expiryMonth: Yup.string()
        .when('$paymentMethod', {
          is: 'credit-card',
          then: () => Yup.string()
            .required('Expiry month is required')
            .matches(/^(0[1-9]|1[0-2])$/, 'Month must be between 01-12'),
        }),
      expiryYear: Yup.string()
        .when('$paymentMethod', {
          is: 'credit-card',
          then: () => Yup.string()
            .required('Expiry year is required')
            .matches(/^[0-9]{2}$/, 'Year must be 2 digits'),
        }),
      cvv: Yup.string()
        .when('$paymentMethod', {
          is: 'credit-card',
          then: () => Yup.string()
            .required('CVV is required')
            .matches(/^[0-9]{3,4}$/, 'CVV must be 3 or 4 digits'),
        }),
    }),
    context: { paymentMethod },
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setError(null);
      
      try {
        // In a real app, you would call your payment API
        // const response = await axios.post('/api/v1/payments/process', {
        //   ...values,
        //   paymentMethod,
        // });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setActiveStep(2);
        setSuccess(true);
      } catch (err) {
        setError(err.response?.data?.message || 'Payment processing failed. Please try again.');
        console.error(err);
      } finally {
        setIsSubmitting(false);
      }
    },
  });
  
  const handleNext = () => {
    if (activeStep === 0) {
      // Validate first step
      let hasErrors = false;
      if (formik.values.amount === '') {
        formik.setFieldError('amount', 'Amount is required');
        hasErrors = true;
      }
      
      if (paymentMethod === 'credit-card') {
        ['cardNumber', 'cardName', 'expiryMonth', 'expiryYear', 'cvv'].forEach(field => {
          if (formik.values[field] === '') {
            formik.setFieldError(field, `${field} is required`);
            hasErrors = true;
          }
        });
      }
      
      if (hasErrors) {
        return;
      }
      
      setActiveStep(1);
    } else if (activeStep === 1) {
      formik.handleSubmit();
    }
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  const formatCurrency = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: formik.values.currency
    }).format(value);
  };
  
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" fontWeight="medium" gutterBottom>
                  Payment Details
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="amount"
                  name="amount"
                  label="Amount"
                  variant="outlined"
                  type="number"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  value={formik.values.amount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.amount && Boolean(formik.errors.amount)}
                  helperText={formik.touched.amount && formik.errors.amount}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label="Description"
                  variant="outlined"
                  placeholder="Payment description (optional)"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" fontWeight="medium" gutterBottom sx={{ mt: 2 }}>
                  Payment Method
                </Typography>
                
                <FormControl component="fieldset">
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <PaymentMethodCard 
                        icon={<CreditCardIcon color="primary" />}
                        label="Credit Card"
                        value="credit-card"
                        selected={paymentMethod === 'credit-card'}
                        onChange={setPaymentMethod}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <PaymentMethodCard 
                        icon={<BankIcon color="primary" />}
                        label="Bank Transfer"
                        value="bank-transfer"
                        selected={paymentMethod === 'bank-transfer'}
                        onChange={setPaymentMethod}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <PaymentMethodCard 
                        icon={<PayPalIcon color="primary" />}
                        label="PayPal"
                        value="paypal"
                        selected={paymentMethod === 'paypal'}
                        onChange={setPaymentMethod}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <PaymentMethodCard 
                        icon={<AppleIcon color="primary" />}
                        label="Apple Pay"
                        value="apple-pay"
                        selected={paymentMethod === 'apple-pay'}
                        onChange={setPaymentMethod}
                      />
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>
              
              {paymentMethod === 'credit-card' && (
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography variant="h6" fontWeight="medium" gutterBottom>
                    Card Details
                  </Typography>
                  <CreditCardForm formik={formik} />
                </Grid>
              )}
            </Grid>
          </>
        );
      
      case 1:
        return (
          <>
            <Typography variant="h6" fontWeight="medium" gutterBottom>
              Review Your Payment
            </Typography>
            
            <Box sx={{ my: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Amount:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" fontWeight="medium">
                    {formatCurrency(formik.values.amount)}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Description:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    {formik.values.description || 'N/A'}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Payment Method:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" fontWeight="medium">
                    {paymentMethod === 'credit-card' ? 'Credit Card' : 
                     paymentMethod === 'bank-transfer' ? 'Bank Transfer' :
                     paymentMethod === 'paypal' ? 'PayPal' : 'Apple Pay'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            
            {paymentMethod === 'credit-card' && (
              <>
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                  Card Information
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Card Number:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1">
                      •••• •••• •••• {formik.values.cardNumber.slice(-4)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Name on Card:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1">
                      {formik.values.cardName}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Expiry Date:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1">
                      {formik.values.expiryMonth}/{formik.values.expiryYear}
                    </Typography>
                  </Grid>
                </Grid>
              </>
            )}
          </>
        );
      
      case 2:
        return (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            {success ? (
              <>
                <Box 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '50%', 
                    bgcolor: 'success.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px'
                  }}
                >
                  <Typography variant="h4" color="white">✓</Typography>
                </Box>
                
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Payment Successful!
                </Typography>
                
                <Typography variant="body1" color="text.secondary" paragraph>
                  Your payment of {formatCurrency(formik.values.amount)} has been processed successfully.
                </Typography>
                
                <Typography variant="body2" paragraph>
                  Transaction ID: #A12345678
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  A confirmation receipt has been sent to your email.
                </Typography>
                
                <Button 
                  variant="contained" 
                  color="primary" 
                  sx={{ mt: 3 }}
                  onClick={() => {
                    setActiveStep(0);
                    setSuccess(false);
                    formik.resetForm();
                  }}
                >
                  Make Another Payment
                </Button>
              </>
            ) : (
              <>
                <CircularProgress size={60} sx={{ mb: 3 }} />
                <Typography variant="h6">
                  Processing your payment...
                </Typography>
              </>
            )}
          </Box>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="600">
        Make a Payment
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Process a secure payment through our platform.
      </Typography>
      
      <Card elevation={0} sx={{ mb: 4 }}>
        <CardContent>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {renderStepContent(activeStep)}
          
          {activeStep !== 2 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                variant="outlined"
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={isSubmitting}
              >
                {activeStep === steps.length - 2 ? 'Pay Now' : 'Continue'}
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Payments; 