const express = require('express');
const {
  createNotification,
  fetchNotifications,
  markAsRead,
  deleteNotification,
  // getAdminNotifications, // Uncomment if implemented
} = require('../controllers/notificationController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Apply authentication and CSRF protection to all routes
router.use(protect);

// Define the routes
router.route('/')
  .get(fetchNotifications)   // Fetch all notifications for the authenticated user
  .post(createNotification); // Create a new notification

router.route('/:id/mark-as-read') // Mark a specific notification as read
  .patch(markAsRead);

router.route('/:id')
  .delete(deleteNotification); // Delete a specific notification

// Placeholder: Route for admin notifications
// router.route('/admin')
//   .get(authMiddleware.restrictTo('admin'), getAdminNotifications); // Uncomment and implement if needed

module.exports = router;
