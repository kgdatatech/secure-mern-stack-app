const express = require('express');
const {
  updateUserProfile,
  deleteUserProfile,
  getAdminUsers,
  confirmPasswordReset,
  confirmEmailVerification,
  getUserStatus,
  getActiveParticipantsCount,
  addUserInfo, // Import the new controller function
} = require('../controllers/userController');
const { getAllPrograms, getProgram } = require('../controllers/programController');
const { protect, roleMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

// User profile routes
router.put('/profile', protect, updateUserProfile);
router.delete('/profile', protect, deleteUserProfile);

// Route to get admin users only
router.get('/admins', protect, roleMiddleware(['user']), getAdminUsers);

// Route for confirming password reset
router.post('/confirm-password-reset', protect, confirmPasswordReset);

// Route for confirming email verification
router.post('/confirm-email-verification', protect, confirmEmailVerification);

// Route to get user status
router.get('/status', protect, getUserStatus);

// Route to get active participants count
router.get('/active-participants-count', protect, getActiveParticipantsCount);

// Route to add child information
router.post('/add-user-info', protect, addUserInfo); // New route for adding child info

// User program routes
router.get('/programs', protect, getAllPrograms);
router.get('/programs/:id', protect, getProgram);

module.exports = router;
