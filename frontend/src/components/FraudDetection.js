import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  CircularProgress,
  useTheme,
  useMediaQuery,
  TextField,
  Button,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import { fraudService } from '../services/api';

const FraudDetection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    transactionId: '',
    amount: '',
    currency: 'USD',
    ipAddress: '',
    userAgent: '',
  });
  const [checkResult, setCheckResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setCheckResult(null);

    try {
      const response = await fraudService.checkTransaction(formData);
      setCheckResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to check transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: isMobile ? 2 : 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Fraud Detection
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Check Transaction
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Transaction ID"
                    name="transactionId"
                    value={formData.transactionId}
                    onChange={handleChange}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Amount"
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="EUR">EUR</MenuItem>
                    <MenuItem value="GBP">GBP</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="IP Address"
                    name="ipAddress"
                    value={formData.ipAddress}
                    onChange={handleChange}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="User Agent"
                    name="userAgent"
                    value={formData.userAgent}
                    onChange={handleChange}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Check Transaction'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Check Results
            </Typography>

            {checkResult && (
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Risk Score</TableCell>
                      <TableCell>
                        <Chip
                          label={`${checkResult.riskScore}%`}
                          color={
                            checkResult.riskScore > 70
                              ? 'error'
                              : checkResult.riskScore > 30
                              ? 'warning'
                              : 'success'
                          }
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Status</TableCell>
                      <TableCell>
                        <Chip
                          label={checkResult.isFraudulent ? 'Fraudulent' : 'Safe'}
                          color={checkResult.isFraudulent ? 'error' : 'success'}
                        />
                      </TableCell>
                    </TableRow>
                    {checkResult.reasons && checkResult.reasons.length > 0 && (
                      <TableRow>
                        <TableCell>Reasons</TableCell>
                        <TableCell>
                          <ul style={{ margin: 0, paddingLeft: 20 }}>
                            {checkResult.reasons.map((reason, index) => (
                              <li key={index}>{reason}</li>
                            ))}
                          </ul>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FraudDetection; 