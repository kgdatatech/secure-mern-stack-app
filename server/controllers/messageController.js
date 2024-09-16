const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { 
  sendChatNotificationEmail,
  sendNewUserRegistrationEmail,
  sendPaymentNotificationEmail 
} = require('../utils/emailUtils');

// Create a new conversation
const createConversation = async (req, res) => {
  const { participantIds } = req.body;

  try {
    const conversation = await Conversation.create({ participants: participantIds });
    res.status(201).json({ success: true, data: conversation });
  } catch (error) {
    console.error('Error in createConversation:', error.message);
    res.status(500).json({ success: false, error: 'Failed to create conversation' });
  }
};

// Get all conversations for a user
const getUserConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.user.id })
      .populate('participants', 'name email')
      .populate('lastMessage', 'content createdAt');

    res.status(200).json({ success: true, data: conversations });
  } catch (error) {
    console.error('Error in getUserConversations:', error.message);
    res.status(500).json({ success: false, error: 'Failed to retrieve conversations' });
  }
};

// Get all messages for a specific conversation
const getConversationMessages = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const messages = await Message.find({ conversationId })
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .sort({ createdAt: 1 }); // Sort messages by creation date in ascending order

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error('Error in getConversationMessages:', error.message);
    res.status(500).json({ success: false, error: 'Failed to retrieve messages' });
  }
};

// Delete a conversation
const deleteConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({ success: false, error: 'Conversation not found' });
    }

    // Delete all messages associated with this conversation
    await Message.deleteMany({ conversationId: conversation._id });

    // Delete the conversation itself
    await Conversation.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error('Error in deleteConversation:', error.message);
    res.status(500).json({ success: false, error: 'Failed to delete conversation' });
  }
};

// Update conversation name
const updateConversationName = async (req, res) => {
  const { conversationId } = req.params;
  const { newName } = req.body;

  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    conversation.name = newName;
    await conversation.save();

    res.status(200).json({ message: 'Conversation name updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const sendMessage = async (req, res) => {
  const { receiver, content } = req.body;

  try {
    // Find the receiver by username, email, name, or googleID
    const user = await User.findOne({
      $or: [{ username: receiver }, { email: receiver }, { name: receiver }, { googleID: receiver }]
    });

    if (!user || !user.email) {
      return res.status(404).json({
        success: false,
        error: 'Receiver not found or has no email',
      });
    }

    const sender = req.user; // Assuming req.user contains the sender's information

    // Create a new message
    const message = await Message.create({
      sender: sender.id,
      receiver: user._id,
      content,
    });

    const io = req.app.get('io');
    if (io) {
      // Emit the message and notification events first to ensure real-time feedback
      io.to(user._id.toString()).emit('newMessage', {
        type: 'message',
        message: `You have a new message from ${sender.name}`,
        data: message,
      });

      // Create a new notification for the receiver
      const notification = await Notification.create({
        userId: user._id,
        recipient: user._id,
        sender: sender.id,
        type: 'message',
        message: `You have a new message from ${sender.name}`,
        data: message._id,
        read: false,
      });

      // Emit the notification to the receiver's room
      io.to(user._id.toString()).emit('newNotification', notification);
    } else {
      console.error('Socket.IO instance not found');
    }

    // Send an email notification to the recipient only
    await sendChatNotificationEmail(user, sender, content);

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (err) {
    console.error('Error in sendMessage:', err);
    res.status(500).json({
      success: false,
      error: 'An error occurred while sending the message',
    });
  }
};


// Get messages for a user
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }],
    })
      .populate('sender', 'name email')
      .populate('receiver', 'name email');

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (err) {
    console.error('Error in getMessages:', err.message);
    res.status(500).json({
      success: false,
      error: 'An error occurred while retrieving messages',
    });
  }
};

// Delete a message
const deleteMessage = async (req, res) => {
  try {
    console.log(`Attempting to delete message with ID: ${req.params.id}`);

    const message = await Message.findById(req.params.id);

    if (!message) {
      console.warn(`Message not found for ID: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        error: 'Message not found',
      });
    }

    await Message.deleteOne({ _id: req.params.id });

    console.log(`Successfully deleted message with ID: ${req.params.id}`);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    console.error(`Error occurred while trying to delete message with ID: ${req.params.id}`, err.message);
    res.status(500).json({
      success: false,
      error: 'An error occurred while deleting the message',
    });
  }
};

// Bulk delete messages in a conversation
const bulkDeleteMessages = async (req, res) => {
  const userId = req.params.userId; // ID of the other user in the conversation
  const authUserId = req.user._id; // Authenticated user's ID

  try {
    await Message.deleteMany({
      $or: [
        { sender: authUserId, receiver: userId },
        { sender: userId, receiver: authUserId }
      ]
    });
    res.status(200).json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Archive a conversation
const archiveConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = await Conversation.findByIdAndUpdate(conversationId, { isArchived: true });
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    res.status(200).json({ message: 'Conversation archived successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error archiving conversation', error });
  }
};

// Restore an archived conversation
const restoreConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = await Conversation.findByIdAndUpdate(conversationId, { isArchived: false });
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    res.status(200).json({ message: 'Conversation restored successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error restoring conversation', error });
  }
};

// Permanently delete a conversation and its messages
const permanentlyDeleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Delete all messages related to this conversation
    await Message.deleteMany({ conversationId });

    // Delete the conversation
    await Conversation.findByIdAndDelete(conversationId);

    res.status(200).json({ message: 'Conversation and messages permanently deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error permanently deleting conversation', error });
  }
};



module.exports = {
  createConversation,
  getUserConversations,
  getConversationMessages,
  deleteConversation,
  updateConversationName,
  sendMessage,
  getMessages,
  deleteMessage,
  bulkDeleteMessages,
  archiveConversation,
  restoreConversation,
  permanentlyDeleteConversation,
};
