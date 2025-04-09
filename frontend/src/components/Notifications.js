import React, { useState, useEffect } from 'react';
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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Email as EmailIcon,
  Sms as SmsIcon,
  Notifications as PushIcon,
} from '@mui/icons-material';
import { notificationService } from '../services/api';

const Notifications = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [formData, setFormData] = useState({
    type: 'email',
    recipient: '',
    message: '',
  });

  useEffect(() => {
    // Fetch recent notifications
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      // In a real application, you would fetch notifications from the backend
      // For now, we'll use mock data
      const mockNotifications = [
        {
          id: 1,
          type: 'email',
          recipient: 'user@example.com',
          message: 'Payment successful',
          timestamp: new Date(),
        },
        {
          id: 2,
          type: 'sms',
          recipient: '+1234567890',
          message: 'Subscription renewed',
          timestamp: new Date(),
        },
      ];
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

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
    setSuccess('');

    try {
      await notificationService.sendNotification(formData);
      setSuccess('Notification sent successfully!');
      setFormData({
        type: 'email',
        recipient: '',
        message: '',
      });
      fetchNotifications();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'email':
        return <EmailIcon />;
      case 'sms':
        return <SmsIcon />;
      case 'push':
        return <PushIcon />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: isMobile ? 2 : 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Notifications
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Send Notification
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value="email">Email</MenuItem>
                    <MenuItem value="sms">SMS</MenuItem>
                    <MenuItem value="push">Push Notification</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Recipient"
                    name="recipient"
                    value={formData.recipient}
                    onChange={handleChange}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    multiline
                    rows={4}
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
                    {loading ? <CircularProgress size={24} /> : 'Send Notification'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Recent Notifications
            </Typography>
            <List>
              {notifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem>
                    <ListItemIcon>
                      {getNotificationIcon(notification.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={notification.message}
                      secondary={`${notification.recipient} - ${new Date(
                        notification.timestamp
                      ).toLocaleString()}`}
                    />
                  </ListItem>
                  {index < notifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Notifications; 