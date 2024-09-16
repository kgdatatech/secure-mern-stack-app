import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useDashboardData from '../../hooks/useDashboardData';
import useAuthProvider from '../../hooks/useAuthProvider';
import DashboardSidebar from './DashboardSidebar';
import DashboardContent from './DashboardContent';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axiosInstance';

Modal.setAppElement('#root');

const Dashboard = ({ theme }) => { // Accept theme as a prop from App
  const navigate = useNavigate();
  const location = useLocation();
  const [editingUser, setEditingUser] = useState(null);
  const [editingProgram, setEditingProgram] = useState(null);
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false); // Manage sidebar collapse state
  const data = useDashboardData();
  const { currentUser, logout } = useAuthProvider();

  const params = new URLSearchParams(location.search);
  const initialTab = params.get('tab') || 'dashboard';
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    navigate(`?tab=${activeTab}`, { replace: true });
  }, [activeTab, navigate]);

  useEffect(() => {
    const handleTabUpdate = () => {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab) {
        setActiveTab(tab);
      }
    };

    window.addEventListener('updateTab', handleTabUpdate);

    return () => {
      window.removeEventListener('updateTab', handleTabUpdate);
    };
  }, []);

  const handleCreateUser = () => {
    setEditingUser(null);
    setActiveTab('userForm');
  };

  const handleCreateProgram = () => {
    setEditingProgram(null);
    setIsProgramModalOpen(true);
  };

  const handleEditProgram = (program) => {
    setEditingProgram(program);
    setIsProgramModalOpen(true);
  };

  const handleDuplicateProgram = async (program) => {
    try {
      await axiosInstance.post('/programs', {
        name: `${program.name} (Copy)`,
        description: program.description,
        duration: program.duration,
        startDate: program.startDate,
        endDate: program.endDate,
        cost: program.cost,
        ageGroup: program.ageGroup,
        classSize: program.classSize,
        location: program.location, // Include the location in the duplication
      });
      toast.success('Program duplicated successfully');
      handleRefreshPrograms();
    } catch (error) {
      toast.error('Failed to duplicate program');
      console.error('Failed to duplicate program:', error);
    }
  };

  const handleDeleteProgram = async (programId) => {
    try {
      await axiosInstance.delete(`/programs/${programId}`);
      toast.success('Program deleted successfully');
      handleRefreshPrograms();
    } catch (error) {
      toast.error('Failed to delete program');
      console.error('Failed to delete program:', error);
    }
  };

  const handleSaveProgram = (savedProgram) => {
    setIsProgramModalOpen(false);
    handleRefreshPrograms();
  };

  const handleRefreshPrograms = async () => {
    setActiveTab('loading');
    setTimeout(() => {
      if (data.role === 'admin') {
        setActiveTab('adminPrograms');
      } else if (data.role === 'user') {
        setActiveTab('userPrograms');
      }
    }, 500);
  };

  return (
    <div className={`flex flex-col h-screen ${theme === 'colored' ? 'bg-indigo-900' : theme === 'dark' ? 'bg-darkBackground' : 'bg-white'}`}>
      <div className="flex-grow flex">
        <DashboardSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          theme={theme} // Pass theme to DashboardSidebar
        />
        <div className="flex-grow flex flex-col overflow-hidden dark:bg-darkBackground dark:text-darkText">
          <DashboardContent
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            data={data}
            editingUser={editingUser}
            setEditingUser={setEditingUser}
            editingProgram={editingProgram}
            setEditingProgram={setEditingProgram}
            isProgramModalOpen={isProgramModalOpen}
            setIsProgramModalOpen={setIsProgramModalOpen}
            handleCreateUser={handleCreateUser}
            handleCreateProgram={handleCreateProgram}
            handleEditProgram={handleEditProgram}
            handleDuplicateProgram={handleDuplicateProgram}
            handleDeleteProgram={handleDeleteProgram}
            handleSaveProgram={handleSaveProgram}
            theme={theme} // Pass theme to DashboardContent
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
