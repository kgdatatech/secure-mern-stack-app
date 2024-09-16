import React, { useState, useEffect, useRef } from 'react';
import { FaTrash, FaReply, FaCheckCircle } from 'react-icons/fa';
import { useSocket } from '../../contexts/SocketContext';

const MessageList = ({ messages = [], onDelete, onReply, currentUser }) => {
  const [allMessages, setAllMessages] = useState([]);
  const [loading, setLoading] = useState(true); // Add a loading state
  const socket = useSocket();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!currentUser) return;

    setLoading(true); // Start loading

    const classifiedMessages = messages.map((message) => {
      if (message?.sender) {
        return {
          ...message,
          isSender: message.sender?._id === currentUser?._id,
        };
      }
      return null;
    }).filter(Boolean);

    setAllMessages(classifiedMessages);
    setLoading(false); // End loading
    scrollToBottom();
  }, [messages, currentUser]);

  useEffect(() => {
    if (socket && currentUser) {
      const handleNewMessage = (newMessage) => {
        if (!newMessage?.sender) return;

        setLoading(true); // Start loading for new messages

        setAllMessages((prevMessages) => {
          const updatedMessages = [
            ...prevMessages,
            {
              ...newMessage,
              isSender: newMessage.sender?._id === currentUser?._id,
            },
          ];
          setLoading(false); // End loading after processing the new message
          scrollToBottom();
          return updatedMessages;
        });
      };

      socket.on('newMessage', handleNewMessage);

      return () => {
        socket.off('newMessage', handleNewMessage);
      };
    }
  }, [socket, currentUser]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex-grow flex flex-col space-y-2 overflow-y-auto border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-darkCard">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 dark:border-gray-600 h-12 w-12"></div>
        </div>
      ) : allMessages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
          <p>No messages yet. Start the conversation by sending a message!</p>
        </div>
      ) : (
        allMessages.map((message) => {
          if (!message) return null;
  
          const senderName = message.isSender
            ? `To: ${message.receiver?.name}`
            : `From: ${message.sender?.name}`;
  
          return (
            <div
              key={message._id}
              className={`p-2 rounded-lg shadow-sm transition-colors duration-300 ${
                message.isSender ? 'bg-blue-100 dark:bg-blue-900 self-end' : 'bg-gray-200 dark:bg-darkBackground self-start'
              } ${message.read ? '' : 'border-l-4 border-blue-500 dark:border-blue-400'}`}
            >
              <div className="flex justify-between items-start">
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  <span className="block font-semibold">{senderName}</span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">
                    {new Date(message.createdAt).toLocaleString()}
                  </span>
                </div>
                {message.read && <FaCheckCircle className="text-green-500 text-xs mt-1" />}
              </div>
              <p className="text-sm text-gray-800 dark:text-gray-100 mt-2">{message.content}</p>
              {!message.isSender && (
                <div className="flex justify-end space-x-2 mt-2 text-xs">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onReply(message.sender?.name);
                    }}
                    className="text-blue-400 dark:text-blue-300 hover:text-blue-500 dark:hover:text-blue-400"
                  >
                    <FaReply className="inline-block" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(message._id);
                    }}
                    className="text-red-400 dark:text-red-300 hover:text-red-500 dark:hover:text-red-400"
                  >
                    <FaTrash className="inline-block" />
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );  
};

export default MessageList;
