import React, { useState, useEffect } from 'react';
import { updateUserProfile, deleteUserProfile } from '../../services/userService';
import { generate2FASecret, verify2FAToken, disable2FA } from '../../services/authService'; // Import 2FA functions
import { toast } from 'react-toastify';
import { FaUserEdit, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';
import defaultAvatar from '../../assets/default-avatar.png';
import LoadingSpinner from '../common/LoadingSpinner';
import zxcvbn from 'zxcvbn'; // Import zxcvbn for password strength

const ProfileForm = ({ user }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [twoFAEnabled, setTwoFAEnabled] = useState(user.twoFactorEnabled);
  const [twoFASecret, setTwoFASecret] = useState('');
  const [twoFAToken, setTwoFAToken] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(null); // State for password strength

  const isGoogleUser = Boolean(user.googleId);
  const minLength = 8;

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        username: user.username || '',
        password: '',
      });
      setTwoFAEnabled(user.twoFactorEnabled);
      setLoading(false);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'password') {
      const strength = zxcvbn(value);
      setPasswordStrength(strength);
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isGoogleUser) {
      toast.error('Google account users cannot update their profile information here.');
      return;
    }

    if (formData.password && formData.password.length < minLength) {
      toast.error(`Password must be at least ${minLength} characters long.`);
      return;
    }

    if (passwordStrength && passwordStrength.score < 3 && formData.password) {
      toast.error('Password is too weak. Please use a stronger password.');
      return;
    }

    try {
      const updatedData = { ...formData };
      if (formData.password === '') {
        delete updatedData.password;
      }
      await updateUserProfile(updatedData);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await deleteUserProfile();
        toast.success('Account deleted successfully');
      } catch (error) {
        console.error('Failed to delete account:', error);
        toast.error('Failed to delete account');
      }
    }
  };

  const handleEnable2FA = async () => {
    try {
      const { qrCodeUrl, secret } = await generate2FASecret();
      setQrCodeUrl(qrCodeUrl);
      setTwoFASecret(secret);
    } catch (error) {
      console.error('Failed to generate 2FA secret:', error);
      toast.error('Failed to enable 2FA');
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    try {
      await verify2FAToken({ token: twoFAToken });
      setTwoFAEnabled(true);
      toast.success('2FA enabled successfully');
    } catch (error) {
      console.error('Failed to verify 2FA token:', error);
      toast.error('Failed to verify 2FA token');
    }
  };

  const handleDisable2FA = async () => {
    try {
      await disable2FA();
      setTwoFAEnabled(false);
      toast.success('2FA has been disabled successfully.');
    } catch (error) {
      console.error('Failed to disable 2FA:', error);
      toast.error('Failed to disable 2FA');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="h-5/8 w-full max-w-xl mx-auto bg-gray-100 dark:bg-gray-900 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <form
        onSubmit={handleSubmit}
        className={`bg-white dark:bg-gray-800 p-6 sm:p-8 lg:p-10 rounded-lg shadow-md ${isGoogleUser ? 'opacity-50' : ''}`}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <img
              src={defaultAvatar}
              alt="Avatar"
              className="w-12 h-12 rounded-full object-cover mr-4"
            />
            <h2 className="text-2xl font-semibold dark:text-gray-200">Account Settings</h2>
          </div>
        </div>
  
        {isGoogleUser && (
          <div className="mb-4 text-red-600">
            This account is managed by Google. You cannot update your profile information here.
          </div>
        )}
  
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 dark:text-gray-300">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100"
            required
            autoComplete="name"
            disabled={isGoogleUser}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 dark:text-gray-300">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100"
            required
            autoComplete="email"
            disabled={isGoogleUser}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 dark:text-gray-300">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100"
            required
            autoComplete="username"
            disabled={isGoogleUser}
          />
        </div>
        <div className="mb-4 relative">
          <label htmlFor="password" className="block text-gray-700 dark:text-gray-300">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-100"
            placeholder="Update password"
            autoComplete="new-password"
            disabled={isGoogleUser}
          />
          <div
            className="absolute inset-y-0 top-6 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer dark:text-gray-300"
            onClick={() => setShowPassword(!showPassword)}
          >
            {/* {showPassword ? <FaEyeSlash /> : <FaEye />} */}
          </div>
          {passwordStrength && formData.password && (
            <div className={`text-sm mt-2 ${passwordStrength.score < 3 ? 'text-red-500' : 'text-green-500'}`}>
              {passwordStrength.score < 3 ? 'Weak Password' : 'Strong Password'}
            </div>
          )}
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Use at least {minLength} characters, including numbers, symbols, and a mix of uppercase and lowercase letters.
          </div>
        </div>
  
        <div className="flex justify-between items-center mt-6">
          <button
            type="submit"
            className="bg-transparent text-black dark:text-gray-300 h-12 py-2 px-4 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            disabled={isGoogleUser}
          >
            <FaUserEdit className="inline-block mr-2" /> Update Profile
          </button>
          
          <button
            type="button"
            className="bg-transparent text-red-600 dark:text-red-400 h-12 py-2 px-4 flex items-center hover:bg-red-200 dark:hover:bg-red-700 transition-all duration-200"
            onClick={handleDelete}
          >
            <FaTrash className="inline-block mr-2" /> Delete Account
          </button>
        </div>
      </form>
      {/* Footer */}
      <div className="px-0 py-4">
        <div className="mt-12 border-t border-gray-300 dark:border-gray-600 pt-2">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
            <p>&copy; {new Date().getFullYear()} Secure MERN Stack. All rights reserved.</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-black dark:hover:text-white">Support</a>
              <a href="#" className="hover:text-black dark:hover:text-white">Privacy</a>
              <a href="#" className="hover:text-black dark:hover:text-white">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );  
};

export default ProfileForm;
