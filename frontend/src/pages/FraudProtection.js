import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Switch, 
  FormControlLabel, 
  Slider, 
  TextField, 
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  InputAdornment,
  Alert,
  Chip,
  useTheme
} from '@mui/material';
import {
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Settings as SettingsIcon,
  Shield as ShieldIcon,
  Timeline as TimelineIcon,
  Rule as RuleIcon,
  GpsFixed as GpsFixedIcon,
  Devices as DevicesIcon,
  AttachMoney as AttachMoneyIcon,
  LocationOn as LocationOnIcon
} from '@mui/icons-material';

const FraudProtection = () => {
  const theme = useTheme();
  const [settings, setSettings] = useState({
    fraudProtectionEnabled: true,
    riskThreshold: 70,
    blockHighRiskCountries: true,
    verifyAddress: true,
    requireCvv: true,
    detectAnomalousAmount: true,
    enableDeviceFingerprinting: true,
    enableVelocityChecks: true,
    enableMachineLearningScan: true,
    maximumAttempts: 3,
    delayIncremental: true
  });

  const [customRules, setCustomRules] = useState([
    { 
      id: 1, 
      name: 'Block Transactions above $10,000',
      description: 'Automatically block transactions with amount greater than $10,000',
      enabled: true
    },
    { 
      id: 2, 
      name: 'Review International Transactions',
      description: 'Flag international transactions for manual review',
      enabled: true
    },
    { 
      id: 3, 
      name: 'Block IP Addresses from High-Risk Countries',
      description: 'Automatically block transactions from countries with high fraud rates',
      enabled: true
    }
  ]);

  const handleSettingChange = (setting) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setSettings(prevSettings => ({
      ...prevSettings,
      [setting]: value
    }));
  };

  const handleRuleToggle = (ruleId) => {
    setCustomRules(prevRules => 
      prevRules.map(rule => 
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
  };

  return (
    <Box p={3}>
      <Box mb={4} display="flex" alignItems="center">
        <ShieldIcon fontSize="large" color="primary" sx={{ mr: 2 }} />
        <Typography variant="h4" component="h1">
          Fraud Protection
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        Configure your fraud protection settings to help reduce fraudulent transactions and chargebacks.
      </Alert>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                General Settings
              </Typography>
              <Box mb={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.fraudProtectionEnabled}
                      onChange={handleSettingChange('fraudProtectionEnabled')}
                      color="primary"
                    />
                  }
                  label={<Typography variant="subtitle1">Enable Fraud Protection</Typography>}
                />
                <Typography variant="body2" color="textSecondary">
                  When enabled, we'll use machine learning and custom rules to identify and prevent suspicious transactions.
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />
              
              <Typography id="risk-threshold-slider" gutterBottom>
                Risk Threshold: {settings.riskThreshold}%
              </Typography>
              <Box px={2}>
                <Slider
                  value={settings.riskThreshold}
                  onChange={handleSettingChange('riskThreshold')}
                  aria-labelledby="risk-threshold-slider"
                  valueLabelDisplay="auto"
                  step={5}
                  marks
                  min={0}
                  max={100}
                  disabled={!settings.fraudProtectionEnabled}
                />
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="caption" color="textSecondary">
                    Less Restrictive
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    More Restrictive
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1, mb: 3 }}>
                Transactions with a risk score above this threshold will be blocked or flagged for review.
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Protection Measures
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.blockHighRiskCountries}
                        onChange={handleSettingChange('blockHighRiskCountries')}
                        color="primary"
                        disabled={!settings.fraudProtectionEnabled}
                      />
                    }
                    label="Block High-Risk Countries"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.verifyAddress}
                        onChange={handleSettingChange('verifyAddress')}
                        color="primary"
                        disabled={!settings.fraudProtectionEnabled}
                      />
                    }
                    label="Address Verification (AVS)"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.requireCvv}
                        onChange={handleSettingChange('requireCvv')}
                        color="primary"
                        disabled={!settings.fraudProtectionEnabled}
                      />
                    }
                    label="Require CVV Verification"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.detectAnomalousAmount}
                        onChange={handleSettingChange('detectAnomalousAmount')}
                        color="primary"
                        disabled={!settings.fraudProtectionEnabled}
                      />
                    }
                    label="Detect Unusual Transaction Amounts"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableDeviceFingerprinting}
                        onChange={handleSettingChange('enableDeviceFingerprinting')}
                        color="primary"
                        disabled={!settings.fraudProtectionEnabled}
                      />
                    }
                    label="Device Fingerprinting"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableVelocityChecks}
                        onChange={handleSettingChange('enableVelocityChecks')}
                        color="primary"
                        disabled={!settings.fraudProtectionEnabled}
                      />
                    }
                    label="Velocity Checks"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableMachineLearningScan}
                        onChange={handleSettingChange('enableMachineLearningScan')}
                        color="primary"
                        disabled={!settings.fraudProtectionEnabled}
                      />
                    }
                    label="Machine Learning Analysis"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.delayIncremental}
                        onChange={handleSettingChange('delayIncremental')}
                        color="primary"
                        disabled={!settings.fraudProtectionEnabled}
                      />
                    }
                    label="Progressive Delay on Failed Attempts"
                  />
                </Grid>
              </Grid>

              <Box mt={3}>
                <TextField
                  label="Maximum Failed Payment Attempts"
                  type="number"
                  value={settings.maximumAttempts}
                  onChange={handleSettingChange('maximumAttempts')}
                  InputProps={{
                    inputProps: { min: 1, max: 10 }
                  }}
                  disabled={!settings.fraudProtectionEnabled}
                  size="small"
                />
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Number of attempts before temporarily blocking transactions from a customer.
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Custom Rules
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Create custom rules to automate fraud detection based on your business needs.
              </Typography>

              <List>
                {customRules.map((rule, index) => (
                  <React.Fragment key={rule.id}>
                    {index > 0 && <Divider component="li" />}
                    <ListItem 
                      secondaryAction={
                        <Switch
                          edge="end"
                          checked={rule.enabled}
                          onChange={() => handleRuleToggle(rule.id)}
                          disabled={!settings.fraudProtectionEnabled}
                        />
                      }
                    >
                      <ListItemIcon>
                        <RuleIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={rule.name} 
                        secondary={rule.description}
                      />
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>

              <Button 
                variant="outlined" 
                color="primary" 
                startIcon={<RuleIcon />} 
                sx={{ mt: 2 }}
                disabled={!settings.fraudProtectionEnabled}
              >
                Add Custom Rule
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: theme.palette.background.default, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Protection Status
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                bgcolor: settings.fraudProtectionEnabled ? 'success.light' : 'error.light',
                color: settings.fraudProtectionEnabled ? 'success.contrastText' : 'error.contrastText',
                p: 2,
                borderRadius: 1,
                mb: 2
              }}>
                {settings.fraudProtectionEnabled 
                  ? <CheckCircleIcon sx={{ mr: 1 }} /> 
                  : <ErrorIcon sx={{ mr: 1 }} />}
                <Typography variant="subtitle1">
                  {settings.fraudProtectionEnabled 
                    ? 'Fraud Protection is Active' 
                    : 'Fraud Protection is Disabled'}
                </Typography>
              </Box>

              <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
                Protection Features Enabled:
              </Typography>
              <Box sx={{ pl: 2 }}>
                {Object.entries({
                  'Block High-Risk Countries': settings.blockHighRiskCountries,
                  'Address Verification': settings.verifyAddress,
                  'CVV Verification': settings.requireCvv,
                  'Anomalous Amount Detection': settings.detectAnomalousAmount,
                  'Device Fingerprinting': settings.enableDeviceFingerprinting,
                  'Velocity Checks': settings.enableVelocityChecks,
                  'Machine Learning': settings.enableMachineLearningScan,
                }).map(([name, enabled], index) => (
                  <Box key={index} display="flex" alignItems="center" mb={1}>
                    {enabled && settings.fraudProtectionEnabled 
                      ? <CheckCircleIcon fontSize="small" color="success" sx={{ mr: 1 }} />
                      : <ErrorIcon fontSize="small" color="disabled" sx={{ mr: 1 }} />}
                    <Typography 
                      variant="body2" 
                      color={enabled && settings.fraudProtectionEnabled ? 'textPrimary' : 'textSecondary'}
                    >
                      {name}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Protection Tips
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <SecurityIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Use Address Verification" 
                  secondary="Match billing address with the card issuer's records."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <LocationOnIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Enable Geolocation Checks" 
                  secondary="Identify suspicious locations and IP addresses."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <DevicesIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Device Fingerprinting" 
                  secondary="Track and identify suspicious devices across transactions."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <AttachMoneyIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Set Transaction Limits" 
                  secondary="Limit the size or frequency of transactions."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <TimelineIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Monitor Your Dashboard" 
                  secondary="Regularly review transaction patterns and alerts."
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>

      <Box mt={3} display="flex" justifyContent="flex-end">
        <Button sx={{ mr: 2 }}>
          Cancel
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<SettingsIcon />}
        >
          Save Settings
        </Button>
      </Box>
    </Box>
  );
};

export default FraudProtection; 