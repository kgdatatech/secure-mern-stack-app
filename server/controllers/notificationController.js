const Notification = require('../models/Notification');
const { sendNotification } = require('../utils/notificationUtils');

const createNotification = async (req, res) => {
  try {
    const { userId, message, type } = req.body;
    console.log('Creating notification for:', userId, message, type);

    const notification = await sendNotification(userId, message, type, req.app.get('io'));
    res.status(201).json(notification);
  } catch (error) {
    console.error('Failed to create notification:', error.message);
    res.status(500).json({ error: 'Failed to create notification' });
  }
};

const fetchNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    // console.error('Failed to fetch notifications:', error.message);
    // res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    res.status(200).json(notification);
  } catch (error) {
    console.error('Failed to mark notification as read:', error.message);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Failed to delete notification:', error.message);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};

// Placeholder: Functionality for admin-specific notification actions
// const getAdminNotifications = async (req, res) => {
//   // Code to fetch and return notifications specific to admin users
// };

module.exports = {
  createNotification,
  fetchNotifications,
  markAsRead,
  deleteNotification,
  // getAdminNotifications, // Uncomment and implement if needed
};
