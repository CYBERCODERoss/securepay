import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Service
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// Payment Service
export const paymentService = {
  createPayment: (data) => api.post('/payments', data),
  getPayments: () => api.get('/payments'),
};

// Subscription Service
export const subscriptionService = {
  createSubscription: (data) => api.post('/subscriptions', data),
  getSubscriptions: () => api.get('/subscriptions'),
};

// Analytics Service
export const analyticsService = {
  getTransactionAnalytics: (params) => api.get('/analytics/transactions', { params }),
};

// Notification Service
export const notificationService = {
  sendNotification: (data) => api.post('/notifications', data),
};

// Fraud Service
export const fraudService = {
  checkTransaction: (data) => api.post('/fraud/check', data),
};

export default api; 