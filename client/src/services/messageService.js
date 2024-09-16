import axiosInstance from '../utils/axiosInstance';

// Create a new conversation
export const createConversation = async (participantIds) => {
  try {
    const response = await axiosInstance.post('/messages/create', {
      participantIds,
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Fetch all conversations for the logged-in user
export const getUserConversations = async () => {
  try {
    const response = await axiosInstance.get('/messages/user-conversations');
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Fetch messages for a specific conversation
export const getConversationMessages = async (conversationId) => {
  try {
    const response = await axiosInstance.get(`/messages/${conversationId}/messages`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Delete a conversation
export const deleteConversation = async (conversationId) => {
  try {
    const response = await axiosInstance.delete(`/messages/${conversationId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Send a message
export const sendMessage = async (messageData) => {
  try {
    const response = await axiosInstance.post('/messages/send', {
      receiver: messageData.receiver,
      content: messageData.content,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch all messages for the logged-in user
export const fetchMessages = async () => {
  try {
    const response = await axiosInstance.get('/messages/inbox');
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Delete a single message
export const deleteMessage = async (messageId) => {
  try {
    const response = await axiosInstance.delete(`/messages/${messageId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Bulk delete messages in a conversation
export const deleteConversationMessages = async (userId) => {
  try {
    const response = await axiosInstance.delete(`/messages/bulk/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update the conversation name
export const updateConversationName = async (conversationId, newName) => {
  try {
    const response = await axiosInstance.patch(`/messages/${conversationId}/name`, {
      newName,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Archive a conversation
export const archiveConversation = async (conversationId) => {
  try {
    const response = await axiosInstance.post(`/messages/archive/${conversationId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Restore an archived conversation
export const restoreConversation = async (conversationId) => {
  try {
    const response = await axiosInstance.post(`/messages/restore/${conversationId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Permanently delete a conversation
export const permanentlyDeleteConversation = async (conversationId) => {
  try {
    const response = await axiosInstance.delete(`/messages/permanently-delete/${conversationId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
