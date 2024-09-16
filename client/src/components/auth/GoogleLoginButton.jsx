import React from 'react';
import { FcGoogle } from 'react-icons/fc';

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    // window.location.href = "https://yourbusinessdomain.com/api/auth/google"; // PROD
    window.location.href = "https://localhost:5000/api/auth/google"; // DEV
  };

  return (
    <div className="flex justify-center mt-4">
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="flex items-center justify-center w-full bg-white border border-gray-300 p-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-100 custom-button-width"
      >
        <FcGoogle className="mr-2" size={24} />
        <span className="font-semibold">Continue with Google</span>
      </button>
    </div>
  );
};

export default GoogleLoginButton;
