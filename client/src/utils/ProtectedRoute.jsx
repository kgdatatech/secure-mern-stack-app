import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { auth } = useAuth();
  const location = useLocation();

  if (auth.loading) {
    return <LoadingSpinner />;
  }

  if (!auth.user) {
    console.warn('ProtectedRoute: User is not authenticated, bypassing redirect.');
    // Temporarily bypass the redirect to /login
    return children; // Allow access to the route even if the user is not authenticated
  }

  return children;
};

export default ProtectedRoute;
