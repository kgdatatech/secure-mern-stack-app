import React, { useState, useEffect, useCallback } from 'react';
import { FaEnvelope } from 'react-icons/fa';
import { fetchMessages, deleteMessage, sendMessage } from '../../services/messageService';
import SendMessageForm from './SendMessageForm';
import LoadingSpinner from '../common/LoadingSpinner';
import { toast } from 'react-toastify';
import { useSocketEvent } from '../../hooks/useSocketEvent';

const ChatUI = ({ selectedNotification, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [recipient, setRecipient] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchMessagesImmediately = useCallback(async () => {
    try {
      const fetchedMessages = await fetchMessages();
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessagesImmediately();
  }, [fetchMessagesImmediately]);

  useEffect(() => {
    if (selectedNotification) {
      setRecipient(selectedNotification.sender.name);
    }
  }, [selectedNotification]);

  useSocketEvent('newMessage', (newMessage) => {
    setMessages((prev) => [...prev, newMessage]);
  });

  const handleDeleteMessage = useCallback(async (messageId) => {
    try {
      await deleteMessage(messageId);
      setMessages((prev) => prev.filter((message) => message._id !== messageId));
      toast.success('Message deleted successfully');
    } catch (error) {
      console.error('Failed to delete message:', error);
      toast.error('Failed to delete message');
    }
  }, []);

  const handleSendMessage = useCallback(async (newMessage) => {
    // Optimistically update the UI
    setMessages((prev) => [...prev, newMessage]);

    try {
      await sendMessage(newMessage); 
      toast.success('Message sent successfully');
    } catch (error) {
      // console.error('Failed to send message:', error);
      // toast.error('Failed to send message');
    }
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex-grow flex flex-col min-h-0 pt-6">
      <div className="flex-grow flex justify-center w-full bg-gray-100 dark:bg-darkBackground rounded overflow-y-auto">
        <div
          className="w-full max-w-2xl flex flex-col bg-white dark:bg-darkCard rounded-lg shadow-lg"
          style={{ flexGrow: 1, minHeight: '0', height: '100%', padding: '16px' }}
        >
          <div className="flex justify-between items-center">
            <h1 className="text-lg sm:text-xl font-bold mb-4 w-full sm:mb-0 text-gray-800 dark:text-gray-100 border-b border-gray-300 dark:border-gray-700 flex items-center">
              <FaEnvelope className="mr-2" /> {/* Add margin to the right of the icon */}
              Live Support Chat
            </h1>
          </div>
          <div className="flex-grow flex flex-col justify-between min-h-0 p-4">
            <SendMessageForm
              onSend={handleSendMessage}
              recipient={recipient}
              messages={messages}
              onDeleteMessage={handleDeleteMessage}
              onReplyMessage={(senderName) => setRecipient(senderName)}
              currentUser={currentUser}
            />
          </div>
        </div>
      </div>
      <div className="mx-4 sm:mx-8 py-4">
        <div className="mt-12 border-t border-gray-300 dark:border-gray-700 pt-2">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
            <p>&copy; {new Date().getFullYear()} Secure MERN Stack. All rights reserved.</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-black dark:hover:text-gray-300">Support</a>
              <a href="#" className="hover:text-black dark:hover:text-gray-300">Privacy</a>
              <a href="#" className="hover:text-black dark:hover:text-gray-300">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );  
};

export default ChatUI;
