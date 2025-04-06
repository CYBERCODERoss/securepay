import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Custom hook to access the authentication context
 * Provides easy access to authentication state and methods
 */
const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  const { 
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
  } = context;

  return {
    // State
    user,
    loading,
    error,
    isAuthenticated,
    sessionChecked,
    
    // Methods
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
    checkSession,
    
    // Helper methods
    isAdmin: user?.role === 'admin',
    getUserName: () => user?.name || 'User',
    getUserInitials: () => {
      if (user?.name) {
        const nameParts = user.name.split(' ');
        if (nameParts.length > 1) {
          return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
        }
        return user.name[0].toUpperCase();
      }
      return 'U';
    }
  };
};

export default useAuth;