import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GoogleLoginButton from './GoogleLoginButton';
import useRegisterForm from '../../hooks/useRegisterForm';
import useCsrfToken from '../../hooks/useCsrfToken';
import Captcha from '../common/Captcha';
import zxcvbn from 'zxcvbn'; // Import zxcvbn for password strength
import { FaLock } from "react-icons/fa";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminSecret, setShowAdminSecret] = useState(false);
  const csrfToken = useCsrfToken();
  const {
    role, setRole,
    formData, handleChange,
    loading,
    message,
    handleRegister,
  } = useRegisterForm();
  const [captchaToken, setCaptchaToken] = useState('');
  const [step, setStep] = useState(1);
  const [passwordStrength, setPasswordStrength] = useState(null); // State for password strength
  const minLength = 8; // Minimum password length

  const isCaptchaEnabled = import.meta.env.VITE_APP_ENABLE_CAPTCHA === 'true';

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const handlePasswordChange = (e) => {
    handleChange(e);
    const strength = zxcvbn(e.target.value);
    setPasswordStrength(strength);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (formData.password.length < minLength) {
      alert(`Password must be at least ${minLength} characters long.`);
      return;
    }

    if (passwordStrength && passwordStrength.score < 3) {
      alert('Password is too weak. Please use a stronger password.');
      return;
    }

    if (isCaptchaEnabled && !captchaToken) {
      alert('Please complete the CAPTCHA');
      return;
    }

    handleRegister(csrfToken, captchaToken, () => {
      window.location.href = '/login';
    });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-stretch bg-white">
      
      {/* Left side: Custom Design becomes a header banner on mobile */}
      <div className="w-full md:w-1/3 flex bg-gray-950 p-4 md:p-16 relative overflow-hidden md:order-1">
        {/* Background Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-12 h-12 md:w-48 md:h-48 bg-blue-600 opacity-50 rounded-full filter blur-xl"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 md:w-56 md:h-56 bg-green-500 opacity-50 rounded-full filter blur-xl"></div>
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 md:w-40 md:h-40 bg-yellow-500 opacity-50 rounded-lg filter blur-lg"></div>
          <div className="absolute bottom-1/4 right-1/2 transform translate-x-1/2 translate-y-1/2 w-8 h-8 md:w-28 md:h-28 bg-pink-500 opacity-50 rounded-full filter blur-lg"></div>
        </div>

        {/* Content */}
        <div className="text-white text-center md:text-left w-full md:w-2/4 relative z-10">
          <h2 className="text-xl md:text-4xl font-black tracking-tight hidden md:block"></h2>
          <p className="mt-2 md:mt-4 text-sm md:text-lg hidden md:block">
            {/* Take your coding skills to the next level with expert advice, and more! */}
          </p>
          <p className="mt-2 text-sm md:text-lg hidden md:block">
            {/* Save 20% on your pass with code SSA20. */}
          </p>
          <a
            href="#"
            className="inline-block text-white underline hover:text-gray-200 mt-2 md:mt-4"
          >
            {/* Get 20% off → */}
          </a>
        </div>
      </div>

      {/* Right side: Logo, Title, and Registration Form */}
      <div className="bg-white w-full md:w-[343px] lg:w-[568px] flex flex-col justify-start mt-8 p-8 md:p-8 md:order-2">
        
        {/* Logo and Title */}
        <div className="flex flex-col items-start md:items-start">
          <div className="flex items-center mb-8">
            <Link to="/" className="flex items-center">
              <FaLock className="text-3xl text-yellow-400 mr-2" />
              <h1 className="text-2xl font-semibold text-gray-900 font-display">
                Secure MERN Stack<sup className="text-xs text-gray-900 align-super">&reg;</sup>
              </h1>
            </Link>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-2 pb-4">
            Sign up today
          </p>
          <p className="text-lg font-bold text-gray-900 mb-4">
          Have an account?{' '}
            <Link to="/login" className="text-blue-500">
              Log in
            </Link>
          </p>
        </div>

        {/* Registration Form */}
        <div className="flex-1 pt-0 md:w-2/3">
          <div className="text-center mb-4">
            <GoogleLoginButton />
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or with email and password</span>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <div className="relative w-full h-12">
              <div className="absolute inset-0 flex w-full">
                <button
                  type="button"
                  className={`flex-1 text-center font-bold px-4 py-2 rounded-l-lg transition-colors duration-300 ${role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setRole('user')}
                >
                  User
                </button>
                <button
                  type="button"
                  className={`flex-1 text-center font-bold px-4 py-2 rounded-r-lg transition-colors duration-300 ${role === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setRole('admin')}
                >
                  Admin
                </button>
              </div>
            </div>
          </div>

          {message && (
            <div className={`p-2 mb-4 rounded ${message.includes('successful') ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
              {message}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            {step >= 1 && (
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => {
                    handleChange(e);
                    if (e.target.value) setStep(2);
                  }}
                  required
                  autoComplete="name"
                  className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1"
                />
              </div>
            )}

            {step >= 2 && (
              <>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 font-sans"
                  />
                </div>

                <div className="relative">
                  <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) => {
                      handleChange(e);
                      if (e.target.value) setStep(3);
                    }}
                    required
                    autoComplete="username"
                    className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1"
                  />
                </div>
              </>
            )}

            {step >= 3 && (
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => {
                    handlePasswordChange(e);
                    if (e.target.value) setStep(4);
                  }}
                  required
                  autoComplete="new-password"
                  className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                />
                {passwordStrength && formData.password && (
                  <div className={`text-sm mt-2 ${passwordStrength.score < 3 ? 'text-red-500' : 'text-green-500'}`}>
                    {passwordStrength.score < 3 ? 'Weak Password' : 'Strong Password'}
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  Use at least {minLength} characters, including numbers, symbols, and a mix of uppercase and lowercase letters.
                </div>
              </div>
            )}

            {step >= 4 && role === 'admin' && (
              <div className="relative">
                <input
                  type={showAdminSecret ? "text" : "password"}
                  id="adminSecret"
                  name="adminSecret"
                  placeholder="Admin Key"
                  value={formData.adminSecret}
                  onChange={(e) => {
                    handleChange(e);
                    if (e.target.value) setStep(5);
                  }}
                  className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminSecret(!showAdminSecret)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-700"
                  aria-label={showAdminSecret ? 'Hide admin secret' : 'Show admin secret'}
                />
              </div>
            )}

            {step >= 4 && role !== 'admin' && (
              isCaptchaEnabled && <Captcha onChange={handleCaptchaChange} />
            )}

            {step >= 5 && role === 'admin' && (
              isCaptchaEnabled && <Captcha onChange={handleCaptchaChange} />
            )}

            {step >= 4 && (
              <button
                type="submit"
                disabled={loading}
                className="block w-full bg-blue-600 text-white p-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-700"
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            )}
          </form>
        </div>
        {/* Footer Links */}
        <div className="mt-8 text-center text-sm text-gray-500 md:mt-auto md:text-right">
          <p>&copy; 2024 Your Business Name, Inc.</p>
          <p className="space-x-2">
            <a href="#" className="hover:underline">Contact</a> 
            <span>&bull;</span> 
            <a href="#" className="hover:underline">Privacy Policy</a> 
            <span>&bull;</span> 
            <a href="#" className="hover:underline">Terms & Conditions</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
