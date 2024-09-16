import axiosInstance from '../utils/axiosInstance';

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// Log in an existing user
export const loginUser = async (credentials) => {
  try {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

// Log out the current user
export const logoutUser = async () => {
  try {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  } catch (error) {
    console.error("Error logging out user:", error);
    throw error;
  }
};

// Refresh the access token
export const refreshAccessToken = async () => {
  try {
    const response = await axiosInstance.post('/auth/refresh-token');
    return response.data;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw error;
  }
};

// Get CSRF token for secure requests
export const getCsrfToken = async () => {
  try {
    const response = await axiosInstance.get('/csrf-token');
    return response.data.csrfToken; // Ensure this matches the backend response structure
  } catch (error) {
    console.error("Error retrieving CSRF token:", error);
    throw error;
  }
};

// Verify if the user is authenticated
export const verifyAuth = async () => {
  try {
    const response = await axiosInstance.get('/auth/verify');
    return response.data;
  } catch (error) {
    console.error("Error verifying authentication:", error);
    throw error;
  }
};

// Get dashboard data for the authenticated user
export const getDashboardData = async () => {
  const response = await axiosInstance.get('/auth/dashboard');
  return response.data;
};

// Send a request to verify the user's email
export const sendVerificationEmail = async () => {
  const response = await axiosInstance.post('/auth/send-verification');
  return response.data;
};

// Verify the user's email using a token
export const verifyEmail = async (token) => {
  const response = await axiosInstance.get(`/auth/verify-email?token=${token}`);
  return response.data;
};

// Request a password reset
export const requestPasswordReset = async (email) => {
  const response = await axiosInstance.post('/auth/request-reset-password', { email });
  return response.data;
};

// Reset the user's password using a token
export const resetPassword = async (passwordData) => {
  const response = await axiosInstance.post('/auth/reset-password', passwordData);
  return response.data;
};

// Generate 2FA secret
export const generate2FASecret = async () => {
  try {
    const response = await axiosInstance.get('/auth/2fa/generate');
    return response.data;
  } catch (error) {
    console.error("Error generating 2FA secret:", error);
    throw error;
  }
};

// Verify 2FA token
export const verify2FAToken = async (data) => {
  try {
    const csrfToken = await getCsrfToken();  // Retrieve CSRF token
    console.log('Sending 2FA verification request with data:', data);  // Log the data sent
    
    const response = await axiosInstance.post('/auth/2fa/verify', data, {
      headers: {
        'x-csrf-token': csrfToken,  // Include CSRF token in headers
      },
    });
    
    console.log('2FA verification response:', response.data);  // Log the response
    return response.data;
  } catch (error) {
    console.error("2FA verification error:", error.response ? error.response.data : error.message);  // Log the error response
    throw error;
  }
};

// Disable 2FA for the current user
export const disable2FA = async () => {
  try {
    const csrfToken = await getCsrfToken();
    const response = await axiosInstance.post('/auth/2fa/disable', {}, {
      headers: { 'X-CSRF-Token': csrfToken }
    });
    return response.data;
  } catch (error) {
    console.error("Error disabling 2FA:", error);
    throw error;
  }
};
