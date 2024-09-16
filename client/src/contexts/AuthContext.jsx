import React, { createContext, useContext } from 'react';
import useAuthProvider from '../hooks/useAuthProvider';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const authProviderValue = useAuthProvider();

  // console.log('AuthProvider Value:', authProviderValue); // Debugging log

  return (
    <AuthContext.Provider value={authProviderValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  // console.log('useAuth Context:', context); // Debugging log
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
