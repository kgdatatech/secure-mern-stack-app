const express = require('express');
const router = express.Router();
const { 
  getAllPages, 
  getPageByRoute, 
  createOrUpdatePage, 
  getDynamicContent, 
  updateDynamicContent 
} = require('../controllers/cmsPageController');

// Public CMS pages routes
router.get('/', getAllPages); // Get all pages
router.get('/:route', getPageByRoute); // Get a single page by route

// Dynamic content routes
router.get('/:route/:key', getDynamicContent); // Get specific dynamic content by route and key
router.post('/:route/:key', updateDynamicContent); // Update specific dynamic content by route and key

// Admin routes
router.post('/', createOrUpdatePage); // Create or update a CMS page

module.exports = router;
