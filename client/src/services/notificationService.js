import axiosInstance from '../utils/axiosInstance';

const getNotifications = async () => {
  const response = await axiosInstance.get('/notifications');
  return response.data; // Ensure this returns the correct data structure
};

const markAsRead = async (id) => {
  await axiosInstance.patch(`/notifications/${id}/mark-as-read`);
};

const deleteNotification = async (id) => {
  await axiosInstance.delete(`/notifications/${id}`);
};

export default {
  getNotifications,
  markAsRead,
  deleteNotification,
  // You may add additional methods here as needed, e.g., for admin-only notifications
};
