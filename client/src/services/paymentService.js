// client\src\services\paymentService.js
import axiosInstance from '../utils/axiosInstance';

// Create a payment intent
export const createPaymentIntent = async (paymentData) => {
  try {
    const response = await axiosInstance.post('/payment/create-payment-intent', paymentData);
    return response.data;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw error;
  }
};

// Verify subscription status
export const verifySubscriptionStatus = async (userId) => {
  try {
    const response = await axiosInstance.get(`/subscription-status/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error verifying subscription status:", error);
    throw error;
  }
};
