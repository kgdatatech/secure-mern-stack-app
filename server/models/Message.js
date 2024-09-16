const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Conversation' 
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean, 
    default: false,
  },
  status: {
    type: String,
    default: 'sent',
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true, // Added index for better query performance
  },
});

module.exports = mongoose.model('Message', messageSchema);
