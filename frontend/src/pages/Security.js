import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid,
  Button,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  Alert,
  Chip
} from '@mui/material';
import { 
  Security as SecurityIcon,
  Lock as LockIcon,
  VerifiedUser as VerifiedUserIcon,
  Fingerprint as FingerprintIcon,
  PhonelinkLock as PhonelinkLockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Shield as ShieldIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const SecurityPage = () => {
  const [showApiKey, setShowApiKey] = React.useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(true);
  const [ipRestrictionEnabled, setIpRestrictionEnabled] = React.useState(false);
  const [alertsEnabled, setAlertsEnabled] = React.useState(true);

  const toggleShowApiKey = () => {
    setShowApiKey(!showApiKey);
  };

  // Feature card component
  const SecurityFeatureCard = ({ icon, title, description, actionElement }) => (
    <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Box 
            sx={{ 
              mr: 2, 
              display: 'flex', 
              p: 1.5, 
              borderRadius: 2, 
              bgcolor: 'primary.light', 
              color: 'primary.main'
            }}
          >
            {icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {description}
            </Typography>
            {actionElement}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Security
        </Typography>
        <Button
          variant="contained"
          startIcon={<SecurityIcon />}
          sx={{ borderRadius: '50px', px: 3 }}
        >
          Security Audit
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 4, borderRadius: 2 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          Security Status: Strong
        </Typography>
        <Typography variant="body2">
          Your account security is up to date. Last security check: Today at 10:30 AM
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            Security Settings
          </Typography>

          <SecurityFeatureCard
            icon={<LockIcon />}
            title="API Keys"
            description="Secure keys to access our API endpoints programmatically."
            actionElement={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography 
                  variant="body2" 
                  fontFamily="monospace" 
                  sx={{ 
                    p: 1.5, 
                    borderRadius: 1, 
                    bgcolor: 'grey.100', 
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {showApiKey ? 'sk_live_51MpZ72EzYgD9GU8H7i5Y6QdfG5V' : '••••••••••••••••••••••••••••••••'}
                </Typography>
                <IconButton onClick={toggleShowApiKey} color="primary" sx={{ ml: 1 }}>
                  {showApiKey ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
                <Button variant="outlined" sx={{ ml: 1, borderRadius: 28 }}>
                  Regenerate
                </Button>
              </Box>
            }
          />

          <SecurityFeatureCard
            icon={<VerifiedUserIcon />}
            title="Two-Factor Authentication"
            description="Add an extra layer of security to your account by requiring a verification code in addition to your password."
            actionElement={
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" fontWeight={500}>
                  {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </Typography>
                <Switch 
                  checked={twoFactorEnabled} 
                  onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  color="primary"
                />
              </Box>
            }
          />

          <SecurityFeatureCard
            icon={<PhonelinkLockIcon />}
            title="IP Restrictions"
            description="Restrict API access to specific IP addresses for enhanced security."
            actionElement={
              <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" fontWeight={500}>
                    {ipRestrictionEnabled ? 'Enabled' : 'Disabled'}
                  </Typography>
                  <Switch 
                    checked={ipRestrictionEnabled} 
                    onChange={() => setIpRestrictionEnabled(!ipRestrictionEnabled)}
                    color="primary"
                  />
                </Box>
                {ipRestrictionEnabled && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Chip label="192.168.1.1" onDelete={() => {}} size="small" />
                    <Chip label="10.0.0.1" onDelete={() => {}} size="small" />
                    <Button variant="outlined" size="small" sx={{ borderRadius: 28, minHeight: 32 }}>
                      Add IP
                    </Button>
                  </Box>
                )}
              </Box>
            }
          />

          <SecurityFeatureCard
            icon={<FingerprintIcon />}
            title="Security Alerts"
            description="Receive notifications for important security events related to your account."
            actionElement={
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" fontWeight={500}>
                  {alertsEnabled ? 'Enabled' : 'Disabled'}
                </Typography>
                <Switch 
                  checked={alertsEnabled} 
                  onChange={() => setAlertsEnabled(!alertsEnabled)}
                  color="primary"
                />
              </Box>
            }
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, mb: 4, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
            <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
              <Typography variant="h6" fontWeight={600}>
                Security Tips
              </Typography>
            </Box>
            <CardContent>
              <List disablePadding>
                <ListItem disableGutters sx={{ pb: 2 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <InfoIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Use a strong, unique password" 
                    secondary="Combine letters, numbers, and symbols"
                  />
                </ListItem>
                <Divider sx={{ my: 1 }} />
                <ListItem disableGutters sx={{ py: 2 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <InfoIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Enable two-factor authentication" 
                    secondary="Add an extra layer of security to your account"
                  />
                </ListItem>
                <Divider sx={{ my: 1 }} />
                <ListItem disableGutters sx={{ py: 2 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <InfoIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Monitor your account regularly" 
                    secondary="Check for unauthorized activities"
                  />
                </ListItem>
                <Divider sx={{ my: 1 }} />
                <ListItem disableGutters sx={{ pt: 2 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <InfoIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Keep contact information updated" 
                    secondary="Ensure you receive security alerts"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
            <Box sx={{ p: 2, bgcolor: 'warning.light', color: 'warning.dark' }}>
              <Typography variant="h6" fontWeight={600}>
                Recent Activity
              </Typography>
            </Box>
            <CardContent>
              <List disablePadding>
                <ListItem disableGutters sx={{ pb: 2 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <ShieldIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Successful login" 
                    secondary="Today, 10:30 AM • 192.168.1.1"
                  />
                </ListItem>
                <Divider sx={{ my: 1 }} />
                <ListItem disableGutters sx={{ py: 2 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <ShieldIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="API key generated" 
                    secondary="Yesterday, 3:45 PM • 192.168.1.1"
                  />
                </ListItem>
                <Divider sx={{ my: 1 }} />
                <ListItem disableGutters sx={{ pt: 2 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <ShieldIcon color="warning" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Failed login attempt" 
                    secondary="2 days ago, 8:12 PM • 203.0.113.1"
                  />
                </ListItem>
              </List>
              <Button 
                fullWidth 
                variant="outlined" 
                sx={{ mt: 2, borderRadius: 28 }}
              >
                View Full Activity Log
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SecurityPage;