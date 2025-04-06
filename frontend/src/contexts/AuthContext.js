import React, { createContext, useState, useEffect, useCallback } from 'react';

// Create the auth context
export const AuthContext = createContext();

// Simulated user database for demo purposes
const DEMO_USERS = [
  {
    id: '001',
    name: 'John Smith',
    email: 'john.smith@example.com',
    password: 'Password123',
    role: 'admin',
    company: 'ABC Corporation',
    avatar: null
  },
  {
    id: '002',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    password: 'SecurePass456',
    role: 'user',
    company: 'XYZ Industries',
    avatar: null
  },
  {
    id: '003',
    name: 'Demo User',
    email: 'demo@securepay.com',
    password: 'demo123',
    role: 'user',
    company: 'Demo Company',
    avatar: null
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);

  // Check if user is already logged in (from localStorage) and validate session
  useEffect(() => {
    const checkLoggedIn = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        const lastActivity = localStorage.getItem('lastActivity');
        
        // If we have token and user data in localStorage
        if (token && storedUser) {
          // Check if the session is still valid (30 minutes of inactivity)
          const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
          const currentTime = new Date().getTime();
          
          if (lastActivity && (currentTime - parseInt(lastActivity, 10)) < SESSION_TIMEOUT) {
            // Session is still valid
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
            // Update last activity timestamp
            localStorage.setItem('lastActivity', currentTime.toString());
          } else {
            // Session expired, clear localStorage
            console.log('Session expired, logging out');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('lastActivity');
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear localStorage on error
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('lastActivity');
      } finally {
        setLoading(false);
        setSessionChecked(true);
      }
    };
    
    checkLoggedIn();
    
    // Set up activity tracking for session timeout
    const activityHandler = () => {
      if (localStorage.getItem('token')) {
        localStorage.setItem('lastActivity', new Date().getTime().toString());
      }
    };
    
    // Track user activity to update session timeout
    window.addEventListener('mousemove', activityHandler);
    window.addEventListener('keypress', activityHandler);
    window.addEventListener('click', activityHandler);
    window.addEventListener('scroll', activityHandler);
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('mousemove', activityHandler);
      window.removeEventListener('keypress', activityHandler);
      window.removeEventListener('click', activityHandler);
      window.removeEventListener('scroll', activityHandler);
    };
  }, []);

  // Simulate API call to validate credentials
  const validateCredentials = (email, password) => {
    // Find user in our simulated database
    const foundUser = DEMO_USERS.find(user => 
      user.email.toLowerCase() === email.toLowerCase() && 
      user.password === password
    );
    
    // If user is found, remove password before returning
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      return userWithoutPassword;
    }
    
    return null;
  };

  // Generate a realistic JWT token (for demo)
  const generateToken = (userId) => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
      iss: 'securepay-auth-service'
    }));
    
    // In a real app, the signature would be cryptographically secure
    // This is just for demo purposes
    const signature = btoa(`${header}.${payload}`);
    
    return `${header}.${payload}.${signature}`;
  };

  // Login function
  const login = useCallback(async (email, password) => {
    console.log("Login function called with:", email);
    setLoading(true);
    setError(null);
    
    try {
      // Validate inputs
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check credentials against our demo database
      const authenticatedUser = validateCredentials(email, password);
      
      if (!authenticatedUser) {
        throw new Error('Invalid email or password');
      }
      
      // Generate token
      const token = generateToken(authenticatedUser.id);
      
      console.log("User authenticated:", authenticatedUser.name);
      
      // Store token and user info in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(authenticatedUser));
      
      // Track last activity for session timeout
      localStorage.setItem('lastActivity', new Date().getTime().toString());
      
      setUser(authenticatedUser);
      setIsAuthenticated(true);
      return authenticatedUser;
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Register function
  const register = useCallback(async (userData) => {
    console.log("Register function called with:", userData.email);
    setLoading(true);
    setError(null);
    
    try {
      // Validate required fields
      if (!userData.email || !userData.password || !userData.firstName) {
        throw new Error('Required user data is missing');
      }
      
      // Check if password meets requirements
      if (userData.password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }
      
      // Check if user already exists
      const userExists = DEMO_USERS.some(user => 
        user.email.toLowerCase() === userData.email.toLowerCase()
      );
      
      if (userExists) {
        throw new Error('User with this email already exists');
      }
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create new user
      const newUser = {
        id: `user-${Date.now().toString(36)}`,
        name: `${userData.firstName} ${userData.lastName || ''}`.trim(),
        email: userData.email,
        role: 'user',
        company: userData.company || 'Not specified',
        avatar: null
      };
      
      console.log("User registered:", newUser.name);
      
      // Generate token
      const token = generateToken(newUser.id);
      
      // Store token and user info in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      // Track last activity for session timeout
      localStorage.setItem('lastActivity', new Date().getTime().toString());
      
      setUser(newUser);
      setIsAuthenticated(true);
      return newUser;
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    console.log("Logout function called");
    // Remove user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('lastActivity');
    
    // Update state
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Reset password function (mock implementation)
  const resetPassword = useCallback(async (email) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!email) {
        throw new Error('Email is required');
      }
      
      // Check if user exists
      const userExists = DEMO_USERS.some(user => 
        user.email.toLowerCase() === email.toLowerCase()
      );
      
      if (!userExists) {
        // We don't want to reveal if a user exists or not for security reasons
        // So we'll still return success
        console.log("Password reset requested for non-existent user");
      } else {
        console.log("Password reset requested for:", email);
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      setError(error.message || 'Password reset failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update user profile function (mock implementation)
  const updateProfile = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock implementation
      if (userData && isAuthenticated) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const updatedUser = { ...user, ...userData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('lastActivity', new Date().getTime().toString());
        setUser(updatedUser);
        
        return updatedUser;
      } else {
        throw new Error('User data is required and user must be authenticated');
      }
    } catch (error) {
      setError(error.message || 'Profile update failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  // Check session validity and refresh if needed
  const checkSession = useCallback(() => {
    const lastActivity = localStorage.getItem('lastActivity');
    if (lastActivity) {
      const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
      const currentTime = new Date().getTime();
      
      if ((currentTime - parseInt(lastActivity, 10)) >= SESSION_TIMEOUT) {
        // Session expired, log out
        logout();
        return false;
      } else {
        // Update last activity
        localStorage.setItem('lastActivity', currentTime.toString());
        return true;
      }
    }
    return false;
  }, [logout]);

  // Context value
  const contextValue = {
    user,
    loading,
    error,
    isAuthenticated,
    sessionChecked,
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
    checkSession
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 