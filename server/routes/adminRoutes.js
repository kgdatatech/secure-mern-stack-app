// routes/adminRoutes.js

const express = require('express');
const { getAllUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/adminController');
const { createOrUpdatePage } = require('../controllers/cmsPageController');
const { protect, roleMiddleware } = require('../middlewares/authMiddleware');
const { verifyCsrfToken } = require('../utils/csrfUtils');

const router = express.Router();

// Middleware to verify CSRF token
const csrfMiddleware = (req, res, next) => {
  const token = req.headers['x-csrf-token'] || req.cookies['XSRF-TOKEN'];
  if (!token || !verifyCsrfToken(token)) {
    return res.status(403).json({ message: 'Forbidden request, invalid CSRF token' });
  }
  next();
};

router.use(csrfMiddleware);

router.get('/users', protect, roleMiddleware(['admin']), getAllUsers);
router.get('/users/:id', protect, roleMiddleware(['admin']), getUser);
router.post('/users', protect, roleMiddleware(['admin']), createUser);
router.put('/users/:id', protect, roleMiddleware(['admin']), updateUser);
router.delete('/users/:id', protect, roleMiddleware(['admin']), deleteUser);

// Admin protected routes (with a distinct route prefix)
router.delete('/cmsPages', protect, roleMiddleware(['admin']), createOrUpdatePage);

module.exports = router;
