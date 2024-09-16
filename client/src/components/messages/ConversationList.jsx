import React, { useState, useEffect } from 'react';
import {
  getUserConversations,
  archiveConversation,
  restoreConversation,
  permanentlyDeleteConversation
} from '../../services/messageService';
import { FaEllipsisV, FaTrashAlt, FaArchive, FaUndoAlt } from 'react-icons/fa';
import Modal from '../common/Modal';

const ConversationList = ({ onSelectConversation, newConversation, showArchived }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showMenu, setShowMenu] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [modalConversation, setModalConversation] = useState(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await getUserConversations(showArchived);
        setConversations(data);
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      }
    };
    fetchConversations();
  }, [showArchived]);

  useEffect(() => {
    if (newConversation) {
      setConversations(prevConversations => [newConversation, ...prevConversations]);
      setSelectedConversation(newConversation._id);
    }
  }, [newConversation]);

  const handleAction = async () => {
    if (!modalConversation || !modalAction) return;
    
    try {
      switch (modalAction) {
        case 'archive':
          await archiveConversation(modalConversation._id);
          setConversations(prev => prev.filter(conv => conv._id !== modalConversation._id));
          break;
        case 'restore':
          await restoreConversation(modalConversation._id);
          break;
        case 'delete':
          await permanentlyDeleteConversation(modalConversation._id);
          setConversations(prev => prev.filter(conv => conv._id !== modalConversation._id));
          break;
        default:
          break;
      }
      if (selectedConversation === modalConversation._id) {
        setSelectedConversation(null);
        onSelectConversation(null);
      }
      setShowModal(false);
      setModalAction(null);
      setModalConversation(null);
    } catch (error) {
      console.error(`Failed to ${modalAction} conversation:`, error);
    }
  };

  const handleSelectConversation = (conversationId) => {
    setSelectedConversation(conversationId);
    onSelectConversation(conversationId);
  };

  const toggleMenu = (conversationId) => {
    setShowMenu(showMenu === conversationId ? null : conversationId);
  };

  const openModal = (action, conversation) => {
    setModalAction(action);
    setModalConversation(conversation);
    setShowModal(true);
  };

  return (
    <div className="flex flex-col space-y-4">
      {conversations.length > 0 ? (
        conversations.map(conversation => (
          <div
            key={conversation._id}
            className={`p-4 rounded-lg shadow-sm cursor-pointer ${
              selectedConversation === conversation._id ? 'bg-gray-200' : 'bg-white'
            }`}
            onClick={() => handleSelectConversation(conversation._id)}
          >
            <div className="flex justify-between items-center">
              <span>{conversation.name || conversation.participants.map(p => p.name).join(', ')}</span>
              <div className="relative">
                <FaEllipsisV className="cursor-pointer" onClick={() => toggleMenu(conversation._id)} />
                {showMenu === conversation._id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                    <button
                      className="flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 w-full text-left"
                      onClick={() => openModal('archive', conversation)}
                    >
                      <FaArchive className="mr-2" /> Archive
                    </button>
                    <button
                      className="flex items-center px-4 py-2 text-sm text-green-600 hover:bg-green-50 w-full text-left"
                      onClick={() => openModal('restore', conversation)}
                    >
                      <FaUndoAlt className="mr-2" /> Restore
                    </button>
                    <button
                      className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                      onClick={() => openModal('delete', conversation)}
                    >
                      <FaTrashAlt className="mr-2" /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No conversations found.</p>
      )}
      {showModal && (
        <Modal
          title={`${modalAction === 'archive' ? 'Archive' : modalAction === 'restore' ? 'Restore' : 'Delete'} Conversation`}
          onClose={() => setShowModal(false)}
          onConfirm={handleAction}
        >
          {`Are you sure you want to ${modalAction} this conversation?`}
        </Modal>
      )}
    </div>
  );
};

export default ConversationList;
