import React from 'react';
import UserList from '../admin/UserList';
import UserForm from '../admin/UserForm';
import ProfileForm from '../profile/ProfileForm';
import ProgramList from '../programs/ProgramList';
import ProgramForm from '../programs/ProgramForm';
import UserProgramList from '../programs/users/UserProgramList';
import UserProgramDetail from '../programs/users/UserProgramDetail';
import UserProgramForm from '../programs/users/UserProgramForm';
import ChatUI from '../messages/ChatUI';
import LoadingSpinner from '../common/LoadingSpinner';
import CmsOverviewPage from '../admin/cms/CmsOverviewPage';
import HomePageEditor from '../admin/cms/HomePageEditor';
import ProgramsPageEditor from '../admin/cms/ProgramsPageEditor';
import ResourcesPageEditor from '../admin/cms/ResourcesPageEditor';
import PolicyPageEditor from '../admin/cms/PolicyPageEditor';
import DashboardAnalytics from '../admin/DashboardAnalytics';
import WelcomeDashboard from './WelcomeDashboard'; 
import Billing from '../subscribe/Billing';

const DashboardContent = ({
  activeTab,
  setActiveTab,
  data,
  editingUser,
  setEditingUser,
  editingProgram,
  setEditingProgram,
  isProgramModalOpen,
  setIsProgramModalOpen,
  handleCreateUser,
  handleCreateProgram,
  handleEditProgram,
  handleDuplicateProgram,
  handleDeleteProgram,
  handleSaveProgram,
}) => {
  if (!data) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex bg-gray-100 dark:bg-darkBackground dark:text-darkText flex-col flex-grow pt-16 h-[calc(100vh-64px)] overflow-y-auto">
      {activeTab === 'dashboard' && (
        <div>
          <WelcomeDashboard name={data.name} role={data.role} /> 
        </div>
      )}
      {activeTab === 'analytics' && (
        <div>
          <DashboardAnalytics />
        </div>
      )}
      {activeTab === 'messages' && <ChatUI />}
      {activeTab === 'settings' && (
        <ProfileForm
          user={data}
          onCancel={() => setActiveTab(data.role === 'admin' ? 'analytics' : 'dashboard')}
          onSave={() => setActiveTab(data.role === 'admin' ? 'analytics' : 'dashboard')}
        />
      )}
      {activeTab === 'billing' && (
        <Billing />
      )}
      {activeTab === 'users' && (
        <>
          {editingUser ? (
            <UserForm 
              user={editingUser} 
              onCancel={() => {
                setEditingUser(null); 
                setActiveTab('users'); 
              }} 
              onSave={() => setActiveTab('users')} 
            />
          ) : (
            <UserList 
              onEdit={(user) => setEditingUser(user)} 
              onCreate={handleCreateUser} 
            />
          )}
        </>
      )}
      {activeTab === 'adminPrograms' && data.role === 'admin' && (
        <>
          <div className="flex-grow flex flex-col">
            <ProgramList
              onSelectProgram={handleEditProgram}
              onDeleteProgram={handleDeleteProgram}
              onDuplicateProgram={handleDuplicateProgram}
            />
            <ProgramForm
              program={editingProgram}
              onSave={() => {
                handleSaveProgram();
                setActiveTab('adminPrograms'); 
              }}
              isOpen={isProgramModalOpen}
              onRequestClose={() => setIsProgramModalOpen(false)}
            />
          </div>
        </>
      )}
      {activeTab === 'userPrograms' && data.role === 'user' && (
        <UserProgramList />
      )}
      {activeTab === 'userProgramDetail' && data.role === 'user' && (
        <UserProgramDetail />
      )}
      {activeTab === 'userProgramForm' && data.role === 'user' && (
        <UserProgramForm programId={editingProgram ? editingProgram._id : null} />
      )}
      {activeTab === 'updateContent' && (
        <div>
          <CmsOverviewPage setActiveTab={setActiveTab} />
        </div>
      )}
      {activeTab === 'editHome' && <HomePageEditor />}
      {activeTab === 'editPrograms' && <ProgramsPageEditor />}
      {activeTab === 'editResources' && <ResourcesPageEditor />}
      {activeTab === 'editPolicy' && <PolicyPageEditor />}
      {activeTab === 'userForm' && (
        <UserForm 
          onCancel={() => setActiveTab('users')} 
          onSave={() => setActiveTab('users')} 
        />
      )}
      {activeTab === 'loading' && <LoadingSpinner />}
    </div>
  );  
};

export default DashboardContent;
