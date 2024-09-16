// server\routes\programRoutes.js
const express = require('express');
const {
  getAllPrograms,
  getProgram,
  createProgram,
  updateProgram,
  duplicateProgram,
  deleteProgram,
} = require('../controllers/programController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Apply authentication and CSRF protection to all routes
router.use(protect);

// Define the routes
router.get('/', getAllPrograms);
router.get('/:id', getProgram);

// Protect route and only allow access to admins
router.post('/', createProgram);
router.put('/:id', updateProgram);
router.post('/:id/duplicate', duplicateProgram);
router.delete('/:id', deleteProgram);

// Define the routes that users can access
router.get('/', getAllPrograms);
router.get('/:id', getProgram);

module.exports = router;
