import React, { useState, useEffect } from 'react';
import { createConversation, sendMessage } from '../../services/messageService';
import { getAllUsers, getAdminUsers } from '../../services/userService';
import { toast } from 'react-toastify';
import MessageList from './MessageList';
import { FaArrowUp, FaSmile } from 'react-icons/fa';
import Picker from '@emoji-mart/react';
import useAuthProvider from '../../hooks/useAuthProvider';

const SendMessageForm = ({ onSend, recipient, messages, onDeleteMessage, onReplyMessage, selectedConversationId, currentUser }) => {
  const [content, setContent] = useState('');
  const [to, setTo] = useState(recipient || '');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [textareaHeight, setTextareaHeight] = useState('50px');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recipientError, setRecipientError] = useState('');

  const { auth } = useAuthProvider();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let users = [];
        if (auth?.user?.role === 'admin') {
          users = await getAllUsers();
        } else if (auth?.user?.role === 'user') {
          users = await getAdminUsers();
        }
        setSuggestions(users);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        toast.error('Failed to load users. Please make sure you are logged in.');
      }
    };

    if (auth?.user) {
      fetchUsers();
    }
  }, [auth]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const recipientUser = suggestions.find(user => user.email === to || user.name === to);
    if (!recipientUser) {
      setRecipientError('Invalid recipient. Please select a valid user.');
      return;
    }

    try {
      const newMessage = {
        _id: Date.now(),
        content,
        sender: auth.user,
        receiver: recipientUser,
        createdAt: new Date().toISOString(),
      };

      // Immediately update the UI
      onSend(newMessage);

      let conversationId = selectedConversationId;
      if (!conversationId) {
        const conversation = await createConversation([auth?.user?.id, recipientUser._id]);
        conversationId = conversation._id;
      }

      await sendMessage({ conversationId, receiver: to, content });

      setContent('');
      setTo('');
      setTextareaHeight('50px');
      toast.success('Message sent successfully');
      setRecipientError('');
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setContent(value);

    if (value === '') {
      setTextareaHeight('50px');
    } else {
      setTextareaHeight(`${Math.min(e.target.scrollHeight, 150)}px`);
    }

    if (value.includes('@')) {
      const query = value.split('@').pop().toLowerCase();
      if (query) {
        const filteredSuggestions = suggestions.filter(user =>
          user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)
        );
        setSuggestions(filteredSuggestions);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const handleRecipientChange = (e) => {
    const value = e.target.value;
    setTo(value);

    if (value.endsWith('@')) {
      setShowSuggestions(true);
    } else if (value.includes('@')) {
      const query = value.split('@').pop().toLowerCase();
      if (query) {
        const filteredSuggestions = suggestions.filter(user =>
          user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)
        );
        setSuggestions(filteredSuggestions);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (user) => {
    setTo(user.email);
    setShowSuggestions(false);
    setRecipientError('');
  };

  const addEmoji = (emoji) => {
    setContent(content + emoji.native);
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    setTo(recipient);
  }, [recipient]);

  return (
    <div className="flex flex-col space-y-4 h-full">
      <MessageList
        messages={messages}
        onDelete={onDeleteMessage}
        onReply={onReplyMessage}
        currentUser={auth.user}
      />
  
      <div>
        <label htmlFor="to" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          To:
        </label>
        <div className="relative">
          {showSuggestions && (
            <div className="absolute z-10 bg-white dark:bg-darkCard border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg mb-1 w-full bottom-full">
              {suggestions.map((user) => (
                <div
                  key={user._id}
                  className="p-2 cursor-pointer border border-gray-100 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800"
                  onClick={() => handleSuggestionClick(user)}
                >
                  <p className="text-gray-800 dark:text-gray-100">{user.name} ({user.email})</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
                </div>
              ))}
            </div>
          )}
  
          <input
            id="to"
            type="text"
            className={`mt-1 p-3 pl-4 border ${recipientError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-3xl w-full ${
              to ? 'bg-blue-100 dark:bg-blue-900 focus:bg-blue-200 dark:focus:bg-blue-800' : 'bg-white dark:bg-darkCard'
            }`}
            placeholder="Type '@' to find support"
            required
            value={to}
            onChange={handleRecipientChange}
            style={{ color: to ? 'transparent' : 'inherit' }}
          />
          {to && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 font-bold px-3 py-1 rounded-lg">
                {to}
              </span>
            </div>
          )}
        </div>
        {recipientError && (
          <p className="text-red-500 dark:text-red-400 text-sm mt-2">{recipientError}</p>
        )}
      </div>
  
      <form onSubmit={handleSubmit} className="space-y-4 mt-4 relative">
        <div className="relative flex items-center">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 p-2"
          >
            <FaSmile size={20} />
          </button>
          <textarea
            id="content"
            value={content}
            onChange={handleInputChange}
            className="p-3 pl-14 border border-gray-300 dark:border-gray-600 rounded-3xl w-full resize-none min-h-[50px] max-h-[150px] overflow-y-auto bg-white dark:bg-darkCard text-gray-800 dark:text-gray-100"
            placeholder="Type your message..."
            required
            style={{
              paddingRight: '60px',
              lineHeight: '1.5',
              height: textareaHeight,
              display: 'flex',
              alignItems: 'center',
            }}
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-300 flex items-center justify-center"
          >
            <FaArrowUp size={16} />
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-12 left-2 z-50">
              <Picker onEmojiSelect={addEmoji} />
            </div>
          )}
        </div>
      </form>
    </div>
  );  
};

export default SendMessageForm;
