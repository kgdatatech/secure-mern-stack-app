import { useState } from 'react';
import { verifyEmail } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const useVerifyEmail = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  const handleEmailVerification = async (token) => {
    setIsVerifying(true);
    setVerificationError(null);

    try {
      await verifyEmail(token);
      setIsVerified(true);

      // Show success message and redirect to dashboard
      alert('🎉 Congratulations! Your email has been successfully verified. Redirecting to your enrollment...');
      setTimeout(() => {
        navigate('/enrollment');
      }, 2000); // Redirect after 2 seconds

    } catch (error) {
      setVerificationError(error.response ? error.response.data.message : error.message);
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    isVerifying,
    verificationError,
    isVerified,
    handleEmailVerification,
  };
};

export default useVerifyEmail;
