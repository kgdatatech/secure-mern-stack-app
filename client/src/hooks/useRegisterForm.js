// client\src\hooks\useRegisterForm.js

import { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

const useRegisterForm = () => {
  const [role, setRole] = useState('user');
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    adminSecret: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRegister = async (csrfToken, captchaToken, onSuccess) => {
    setLoading(true);
    try {
      const requestData = { ...formData, role };
      
      if (captchaToken) {
        requestData.captchaToken = captchaToken;
      }
  
      await axiosInstance.post('/auth/register', requestData, {
        headers: { 'X-CSRF-Token': csrfToken },
      });
      
      setLoading(false);
      setMessage('Registration successful! You will be redirected shortly.');
      
      setTimeout(() => {
        onSuccess(); // Redirect or perform other actions after registration
      }, 2000);
    } catch (err) {
      console.error('Registration error:', err.response ? err.response.data : err.message);
      setMessage('Registration failed. Please try again.');
      setLoading(false);
    }
  };  

  return {
    role, setRole,
    formData, setFormData,
    loading, setLoading,
    message, setMessage,
    handleChange,
    handleRegister,
  };
};

export default useRegisterForm;
