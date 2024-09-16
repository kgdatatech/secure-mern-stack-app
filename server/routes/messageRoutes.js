const express = require('express');
const {
  sendMessage,
  getMessages,
  deleteMessage,
  bulkDeleteMessages,
  archiveConversation,
  restoreConversation,
  permanentlyDeleteConversation,
  createConversation, // Moved from conversationController
  getUserConversations, // Moved from conversationController
  getConversationMessages, // Moved from conversationController
  deleteConversation, // Moved from conversationController
  updateConversationName, // Moved from conversationController
} = require('../controllers/messageController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Apply authentication and CSRF protection to all routes
router.use(protect);

// Define message and conversation routes

// Message-related routes
router.post('/send', sendMessage);
router.get('/inbox', getMessages);
router.delete('/:id', deleteMessage);
router.delete('/bulk/:userId', bulkDeleteMessages); // Bulk delete messages based on userId

// Conversation-related routes
router.post('/create', createConversation);
router.get('/user-conversations', getUserConversations);
router.get('/:conversationId/messages', getConversationMessages);
router.delete('/:conversationId', deleteConversation);
router.patch('/:conversationId/name', updateConversationName);

// Routes for archiving, restoring, and permanently deleting conversations
router.post('/archive/:conversationId', archiveConversation);
router.post('/restore/:conversationId', restoreConversation);
router.delete('/permanently-delete/:conversationId', permanentlyDeleteConversation);

module.exports = router;
