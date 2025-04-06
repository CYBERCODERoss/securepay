import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Tabs, Tab, TextField, Button, Divider, Switch, FormControlLabel } from '@mui/material';

function Settings() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Settings
        </Typography>
        <Button
          variant="contained"
          sx={{ borderRadius: '50px', px: 3 }}
        >
          Save Changes
        </Button>
      </Box>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Manage your account settings and preferences.
      </Typography>
      
      <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
        <CardContent sx={{ p: 0 }}>
          <Tabs 
            value={value} 
            onChange={handleChange} 
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider', 
              px: 3,
              backgroundColor: 'background.default'
            }}
          >
            <Tab label="Profile" />
            <Tab label="Security" />
            <Tab label="Notifications" />
            <Tab label="API Keys" />
          </Tabs>
          
          {value === 0 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Profile Information
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    defaultValue="John Doe"
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    defaultValue="john.doe@example.com"
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    defaultValue="+1 (555) 123-4567"
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Company"
                    defaultValue="Acme Inc."
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    defaultValue="123 Main St, New York, NY 10001"
                    margin="normal"
                  />
                </Grid>
              </Grid>
            </Box>
          )}
          
          {value === 1 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Security Settings
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="600">
                    Change Password
                  </Typography>
                  <TextField
                    fullWidth
                    label="Current Password"
                    type="password"
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="New Password"
                    type="password"
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    type="password"
                    margin="normal"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" fontWeight="600">
                    Two-Factor Authentication
                  </Typography>
                  <FormControlLabel 
                    control={<Switch />} 
                    label="Enable two-factor authentication" 
                    sx={{ mt: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Add an extra layer of security to your account by requiring both your password and a verification code.
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
          
          {value === 2 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Notification Preferences
              </Typography>
              
              <Typography variant="subtitle1" fontWeight="600" sx={{ mt: 2 }}>
                Email Notifications
              </Typography>
              
              <FormControlLabel 
                control={<Switch defaultChecked />} 
                label="Payment confirmations" 
              />
              <FormControlLabel 
                control={<Switch defaultChecked />} 
                label="Failed payment attempts" 
              />
              <FormControlLabel 
                control={<Switch defaultChecked />} 
                label="Refund notifications" 
              />
              <FormControlLabel 
                control={<Switch />} 
                label="Marketing updates" 
              />
              
              <Typography variant="subtitle1" fontWeight="600" sx={{ mt: 3 }}>
                SMS Notifications
              </Typography>
              
              <FormControlLabel 
                control={<Switch />} 
                label="Payment confirmations" 
              />
              <FormControlLabel 
                control={<Switch defaultChecked />} 
                label="Failed payment attempts" 
              />
              <FormControlLabel 
                control={<Switch />} 
                label="Security alerts" 
              />
            </Box>
          )}
          
          {value === 3 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                API Keys
              </Typography>
              
              <Typography variant="body1" paragraph>
                Your API keys provide access to your account through API. Keep these private and secure.
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" fontWeight="600">
                  Production API Keys
                </Typography>
                <TextField
                  fullWidth
                  type="password"
                  defaultValue="sk_live_51MpZ72EzYgD9GU8H7i5Y6QdfG5V"
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <Button variant="outlined" size="small">
                        Reveal
                      </Button>
                    ),
                    readOnly: true,
                  }}
                />
                <Button variant="outlined" color="secondary" sx={{ mt: 1, borderRadius: 28 }}>
                  Rotate Key
                </Button>
              </Box>
              
              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle1" fontWeight="600">
                  Test API Keys
                </Typography>
                <TextField
                  fullWidth
                  type="password"
                  defaultValue="sk_test_4eC39HqLyjWDarjtT1zdp7dc"
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <Button variant="outlined" size="small">
                        Reveal
                      </Button>
                    ),
                    readOnly: true,
                  }}
                />
                <Button variant="outlined" color="secondary" sx={{ mt: 1, borderRadius: 28 }}>
                  Rotate Key
                </Button>
              </Box>
              
              <Box sx={{ mt: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Note:</strong> Rotating your API keys will invalidate the current keys. Make sure to update your integrations after rotation.
                </Typography>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default Settings; 