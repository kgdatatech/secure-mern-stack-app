import { useState } from 'react';
import { requestPasswordReset, resetPassword } from '../services/authService'; // For unauthenticated users
import { confirmPasswordReset } from '../services/userService'; // For authenticated users

const useResetPassword = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [resetError, setResetError] = useState(null);
  const [isResetSuccessful, setIsResetSuccessful] = useState(false);

  const handlePasswordResetRequest = async (email) => {
    setIsProcessing(true);
    setResetError(null);

    try {
      await requestPasswordReset(email);
      setIsResetSuccessful(true);
    } catch (error) {
      setResetError(error.response ? error.response.data.message : error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePasswordReset = async (passwordData, isAuthenticated = false) => {
    setIsProcessing(true);
    setResetError(null);

    try {
      if (isAuthenticated) {
        // Confirm password reset for logged-in users
        await confirmPasswordReset(passwordData);
      } else {
        // Reset password for unauthenticated users
        await resetPassword(passwordData);
      }
      setIsResetSuccessful(true);
    } catch (error) {
      setResetError(error.response ? error.response.data.message : error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    resetError,
    isResetSuccessful,
    handlePasswordResetRequest,
    handlePasswordReset,
  };
};

export default useResetPassword;
