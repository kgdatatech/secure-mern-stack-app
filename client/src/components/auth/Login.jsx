import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GoogleLoginButton from './GoogleLoginButton';
import useLoginForm from '../../hooks/useLoginForm';
import useAuthProvider from '../../hooks/useAuthProvider';
import useCsrfToken from '../../hooks/useCsrfToken';
import Captcha from '../common/Captcha';
import LoadingSpinnerLogin from '../common/LoadingSpinnerLogin';
import { FaLock } from "react-icons/fa";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { setAuth } = useAuthProvider();
  const navigate = useNavigate();
  const csrfToken = useCsrfToken();
  const [step, setStep] = useState(1);

  const {
    email, setEmail,
    password, setPassword,
    loading,
    message,
    handleLogin,
  } = useLoginForm(setAuth, navigate);

  const isCaptchaEnabled = import.meta.env.VITE_APP_ENABLE_CAPTCHA === 'true';
  const [captchaToken, setCaptchaToken] = useState('');

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (isCaptchaEnabled && !captchaToken) {
      alert('Please complete the CAPTCHA');
      return;
    }

    await handleLogin(csrfToken, captchaToken);
  };

  // State for handling dynamic content based on screen size
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-stretch bg-white">
      
      {/* Right side: Custom Design becomes a header banner on mobile */}
      <div className="w-full md:w-full flex bg-gray-950 p-4 md:p-16 relative overflow-hidden md:order-2">
        {/* Background Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-12 h-12 md:w-48 md:h-48 bg-blue-600 opacity-50 rounded-full filter blur-xl"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 md:w-56 md:h-56 bg-green-500 opacity-50 rounded-full filter blur-xl"></div>
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 md:w-40 md:h-40 bg-yellow-500 opacity-50 rounded-lg filter blur-lg"></div>
          <div className="absolute bottom-1/4 right-1/2 transform translate-x-1/2 translate-y-1/2 w-8 h-8 md:w-28 md:h-28 bg-pink-500 opacity-50 rounded-full filter blur-lg"></div>
        </div>
  
        {/* Content */}
        <div className="text-white text-center md:text-left w-full md:w-2/4 relative z-10">
          {isMobile ? (
            <a
              href="#"
              className="inline-block text-white underline hover:text-gray-200 mt-2 md:mt-4"
            >
              {/* Get 20% off → */}
            </a>
          ) : (
            <>
              {/* <h2 className="text-xl md:text-4xl font-black tracking-tight">Secure Mern Stack!</h2> */}
              <p className="mt-2 md:mt-4 text-sm md:text-lg">
                {/* Take your coding skills to the next level with expert advice, and more! */}
              </p>
              <p className="mt-2 text-sm md:text-lg">
                {/* Save 20% on your pass with code SSA20. */}
              </p>
              <a
                href="#"
                className="inline-block text-white underline hover:text-gray-200 mt-2 md:mt-4"
              >
                {/* Get 20% off → */}
              </a>
            </>
          )}
        </div>
      </div>
  
      {/* Left side: Logo, Title, and Login Form */}
      <div className="bg-white w-full md:w-[343px] lg:w-[568px] flex flex-col justify-start mt-8 p-8 md:p-8 md:order-1">
        
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
            Log in to your account
          </p>
          <p className="text-lg font-bold text-gray-900 mb-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-500">
              Sign up
            </Link>
          </p>
        </div>
  
        {/* Login Form */}
        <div className="flex-1 pt-0">
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
  
          {/* Success and Error Message */}
          {message && (
            <div className={`text-center my-4 text-sm ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </div>
          )}
  
          <form onSubmit={onSubmit} autoComplete="on" className="space-y-4">
            {step >= 1 && (
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (e.target.value) setStep(2);
                  }}
                  required
                  className="block w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoComplete="email"
                />
              </div>
            )}
            {step >= 2 && (
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (e.target.value) setStep(3);
                  }}
                  required
                  className="block w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                />
              </div>
            )}
            {isCaptchaEnabled && step >= 3 && <Captcha onChange={handleCaptchaChange} />}
            {step >= 3 && (
              <button
                type="submit"
                disabled={loading}
                className="block w-full bg-blue-600 text-white p-3 rounded-md transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-700 flex justify-center items-center"
              >
                {loading ? <LoadingSpinnerLogin /> : 'Next'}
              </button>
            )}
          </form>
  
          <div className="mt-4 font-bold text-sm text-right">
            <Link to="/forgot-password" className="text-gray-500">
              Forgot Password?
            </Link>
          </div>
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

export default Login;
