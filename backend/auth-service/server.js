const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 8081;
const JWT_SECRET = process.env.JWT_SECRET || 'securepay_jwt_secret_key';

// In-memory user database for demonstration
// In a real application, you would use a database
const users = [
  {
    id: '1',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@securepay.com',
    // hashed password: 'password123'
    password: '$2a$10$X7.Rj7qLFLFVbIFJ/J4GreRqvG/VU9kDsGgQ7nbXnZ4WbTHRJlsCS',
    role: 'admin'
  }
];

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Auth service is running' });
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = users.find(u => u.email === email);

    // User not found
    if (!user) {
      // In development mode, automatically create a new user
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: Creating mock user');
        return res.status(200).json({
          token: jwt.sign(
            { id: 'temp-id', email, role: 'user' },
            JWT_SECRET,
            { expiresIn: '24h' }
          ),
          user: {
            id: 'temp-id',
            name: 'Demo User',
            email,
            role: 'user'
          }
        });
      }
      
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      // In development mode, bypass password check
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: Bypassing password check');
      } else {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send response with token and user info
    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, businessName, businessType, phoneNumber, country } = req.body;

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      businessName,
      businessType,
      phoneNumber,
      country,
      role: 'user',
      createdAt: new Date().toISOString()
    };

    // Add user to in-memory database
    users.push(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send response with token and user info
    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        name: `${newUser.firstName} ${newUser.lastName}`,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Verify token endpoint
app.post('/api/auth/verify', (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    res.status(200).json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ valid: false, message: 'Invalid token' });
  }
});

// User info endpoint
app.get('/api/auth/user', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Find user by id
    const user = users.find(u => u.id === decoded.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send user info
    res.status(200).json({
      user: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});

module.exports = app; 