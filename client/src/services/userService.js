import axiosInstance from '../utils/axiosInstance';
import Cookies from 'js-cookie';

// Function to get CSRF token from cookies
const getCsrfToken = () => Cookies.get('XSRF-TOKEN');

// Fetch all users (admin only)
export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get('/admin/users', {
      headers: { 'X-CSRF-Token': getCsrfToken() }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch only admin users
export const getAdminUsers = async () => {
  try {
    const response = await axiosInstance.get('/user/admins', {
      headers: { 'X-CSRF-Token': getCsrfToken() }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch a specific user by ID (admin only)
export const getUser = async (id) => {
  const response = await axiosInstance.get(`/admin/users/${id}`, {
    headers: { 'X-CSRF-Token': getCsrfToken() }
  });
  return response.data;
};

// Create a new user (admin only)
export const createUser = async (userData) => {
  const response = await axiosInstance.post('/admin/users', userData, {
    headers: { 'X-CSRF-Token': getCsrfToken() }
  });
  return response.data;
};

// Update an existing user (admin only)
export const updateUser = async (id, userData) => {
  const response = await axiosInstance.put(`/admin/users/${id}`, userData, {
    headers: { 'X-CSRF-Token': getCsrfToken() }
  });
  return response.data;
};

// Delete a user (admin only)
export const deleteUser = async (id) => {
  try {
    const response = await axiosInstance.delete(`/admin/users/${id}`, {
      headers: { 'X-CSRF-Token': getCsrfToken() }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (userData) => {
  const response = await axiosInstance.put('/user/profile', userData, {
    headers: { 'X-CSRF-Token': getCsrfToken() }
  });
  return response.data;
};

export const deleteUserProfile = async () => {
  const response = await axiosInstance.delete('/user/profile', {
    headers: { 'X-CSRF-Token': getCsrfToken() }
  });
  return response.data;
};

// Confirm email verification (authenticated user)
export const confirmEmailVerification = async (token) => {
  const response = await axiosInstance.post('/user/confirm-email-verification', { token }, {
    headers: { 'X-CSRF-Token': getCsrfToken() }
  });
  return response.data;
};

// Confirm password reset (authenticated user)
export const confirmPasswordReset = async (passwordData) => {
  const response = await axiosInstance.post('/user/confirm-password-reset', passwordData, {
    headers: { 'X-CSRF-Token': getCsrfToken() }
  });
  return response.data;
};

// Get user status
export const getUserStatus = async () => {
  try {
    const response = await axiosInstance.get('/user/status', {
      headers: { 'X-CSRF-Token': getCsrfToken() }
    }); 
    // console.log('Response from /user/status:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching user status:', error);
    throw new Error(error.response?.data?.message || 'Error fetching user status');
  }
};

// Fetch a specific program by ID
export const fetchUserProgramById = async (programId) => {
  try {
    const response = await axiosInstance.get(`/user/programs/${programId}`, {
      headers: { 'X-CSRF-Token': getCsrfToken() }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get active participants count
export const getActiveParticipantsCount = async () => {
  try {
    const response = await axiosInstance.get('/user/active-participants-count', {
      headers: { 'X-CSRF-Token': getCsrfToken() }
    });
    return response.data.activeParticipantsCount;
  } catch (error) {
    console.error('Error fetching active participants count:', error);
    throw new Error(error.response?.data?.message || 'Error fetching active participants count');
  }
};

// New function to add child information
export const addUserInfo = async (userData) => {
  try {
    const response = await axiosInstance.post('/user/add-user-info', userData, {
      headers: { 'X-CSRF-Token': getCsrfToken() }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
