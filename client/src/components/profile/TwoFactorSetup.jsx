import React, { useState, useEffect } from 'react';
import { enableTwoFactor, verifyTwoFactor, disableTwoFactor } from '../../services/userService'; // Ensure correct imports from userService
import { toast } from 'react-toastify';
import { FaQrcode } from 'react-icons/fa';

const TwoFactorSetup = ({ user }) => {
  const [qrCode, setQrCode] = useState(null);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setQrCode(null);
      setTwoFactorCode('');
    }
  }, [user]);

  const handleEnableTwoFactor = async () => {
    setLoading(true);
    try {
      const data = await enableTwoFactor(); // Calls the enable 2FA service
      setQrCode(data.qrCode);
      toast.success('QR Code generated successfully. Scan it with your authenticator app.');
    } catch (error) {
      console.error('Failed to generate QR Code for Two-Factor Authentication:', error);
      toast.error('Failed to generate QR Code for Two-Factor Authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyTwoFactor = async () => {
    setLoading(true);
    try {
      await verifyTwoFactor({ token: twoFactorCode }); // Calls the verify 2FA service
      toast.success('Two-Factor Authentication verified successfully');
      setQrCode(null);
      setTwoFactorCode('');
    } catch (error) {
      console.error('Failed to verify Two-Factor Authentication:', error);
      toast.error('Failed to verify Two-Factor Authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleDisableTwoFactor = async () => {
    setLoading(true);
    try {
      await disableTwoFactor(); // Calls the disable 2FA service
      toast.success('Two-Factor Authentication disabled successfully');
      setQrCode(null);
      setTwoFactorCode('');
    } catch (error) {
      console.error('Failed to disable Two-Factor Authentication:', error);
      toast.error('Failed to disable Two-Factor Authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 text-center">
      {qrCode ? (
        <div>
          <img src={qrCode} alt="QR Code for 2FA" className="mx-auto" />
          <p className="text-gray-700">Scan this QR code with your authentication app and enter the code below.</p>
          <input
            type="text"
            value={twoFactorCode}
            onChange={(e) => setTwoFactorCode(e.target.value)}
            className="mt-2 p-2 border rounded-lg"
            placeholder="Enter 2FA code"
            autoComplete="one-time-code"
            disabled={loading}
          />
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4"
            onClick={handleVerifyTwoFactor}
            disabled={loading || !twoFactorCode}
          >
            {loading ? 'Verifying...' : 'Verify 2FA Code'}
          </button>
        </div>
      ) : (
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-lg"
          onClick={handleEnableTwoFactor}
          disabled={loading}
        >
          {loading ? 'Generating QR Code...' : <><FaQrcode className="inline-block mr-2" /> Enable Two-Factor Authentication</>}
        </button>
      )}
      {user && user.twoFactorEnabled && !qrCode && (
        <button
          className="bg-yellow-500 text-white py-2 px-4 rounded-lg mt-4"
          onClick={handleDisableTwoFactor}
          disabled={loading}
        >
          {loading ? 'Disabling...' : 'Disable Two-Factor Authentication'}
        </button>
      )}
    </div>
  );
};

export default TwoFactorSetup;
