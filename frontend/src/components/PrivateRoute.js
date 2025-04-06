import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

/**
 * A wrapper around protected routes.
 * If the user is not authenticated, redirects to the login page.
 * Otherwise, renders the child routes.
 */
const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading indicator or placeholder while checking authentication
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};

export default PrivateRoute; 