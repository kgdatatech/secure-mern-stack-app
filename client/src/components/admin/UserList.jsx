import React, { useEffect, useState } from 'react';
import { getAllUsers, deleteUser } from '../../services/userService';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaFileExport, FaPlus, FaUserShield } from 'react-icons/fa';
import { CSVLink } from 'react-csv';
import Pagination from './Pagination';
import LoadingSpinner from '../common/LoadingSpinner';

const UserList = ({ onEdit, onCreate }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch users');
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();

    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener('resize', checkScreenSize);
    checkScreenSize();

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      setUsers(users.filter(user => user._id !== id));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const newSelectedUsers = currentUsers.map(user => user._id);
      setSelectedUsers(newSelectedUsers);
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter(userId => userId !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const filteredUsers = users.filter(user =>
    (user.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (user.role?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (user.subscriptionStatus?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (user.oneOffPaymentStatus?.toLowerCase() || '').includes(search.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (users.length === 0) {
    return <div>No users available.</div>;
  }

  return (
    <div className="h-full w-full mx-auto px-4 py-6 bg-transparent rounded-lg pt-12 pb-24">
      <h1 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-gray-100 border-b border-gray-300 dark:border-gray-700 pt-6 flex items-center">
        <FaUserShield className="mr-2" />
        User Management System
      </h1>
      <div className="text-right mr-4 pt-2">
        <a 
          href="https://cloud.mongodb.com/v2/665a8626119d6b2226930f92#/overview" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
        >
          Go to MongoDB
        </a>
      </div>
      <div className="flex flex-col sm:flex-row justify-between mb-4">
        <input
          type="text"
          className="p-3 border border-gray-300 dark:border-gray-700 rounded h-4 w-full sm:w-1/3 mb-4 sm:mb-0 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-darkInput dark:text-gray-100"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="bg-transparent text-black dark:text-white h-12 py-2 px-4 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
          onClick={onCreate}
        >
          <FaPlus className="mr-2" />
          Create New Client
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-darkCard rounded-lg shadow-md">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-normal">
            <tr>
              <th className="px-2 sm:px-4 py-2 border-b-2 border-gray-300 dark:border-gray-700 text-left">Select</th>
              <th className="px-2 sm:px-4 py-2 border-b-2 border-gray-300 dark:border-gray-700 text-left">Name</th>
              <th className="px-2 sm:px-4 py-2 border-b-2 border-gray-300 dark:border-gray-700 text-left">Email</th>
              <th className="px-2 sm:px-4 py-2 border-b-2 border-gray-300 dark:border-gray-700 text-left">Role</th>
              <th className="px-2 sm:px-4 py-2 border-b-2 border-gray-300 dark:border-gray-700 text-left">Verified</th>
              <th className="px-2 sm:px-4 py-2 border-b-2 border-gray-300 dark:border-gray-700 text-left">Status</th>
              <th className="px-2 sm:px-4 py-2 border-b-2 border-gray-300 dark:border-gray-700 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map(user => (
              <tr key={user._id} className="bg-white dark:bg-darkCard border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
                <td className="px-2 sm:px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => handleSelectUser(user._id)}
                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                  />
                </td>
                <td className="px-2 sm:px-4 py-2">{user.name}</td>
                <td className="px-2 sm:px-4 py-2">{user.email}</td>
                <td className="px-2 sm:px-4 py-2">{user.role}</td>
                <td className="px-2 sm:px-4 py-2">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isVerified ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'}`}>
                    {user.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                </td>
                <td className="px-2 sm:px-4 py-2">
                  {user.role === 'admin' ? (
                    <span className="text-xs text-gray-500 dark:text-gray-400">N/A</span>
                  ) : user.subscriptionTier === 'one-off' && user.oneOffPaymentStatus === 'completed' ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      One-Off Payment
                    </span>
                  ) : user.subscriptionStatus === 'active' ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                      Active Subscription
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="px-2 sm:px-4 py-2 flex space-x-2">
                  <button
                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition duration-150 ease-in-out"
                    onClick={() => onEdit(user)}
                  >
                    <FaEdit />
                  </button>
                  {user.role === 'admin' ? (
                    <button
                      className="text-gray-400 cursor-not-allowed"
                      disabled
                    >
                      <FaTrash />
                    </button>
                  ) : (
                    <button
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition duration-150 ease-in-out"
                      onClick={() => handleDelete(user._id)}
                    >
                      <FaTrash />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col sm:flex-row justify-between mt-6">
        <CSVLink
          data={users}
          className="bg-transparent text-gray-700 dark:text-gray-100 text-sm py-2 px-4 rounded-lg flex items-center justify-center hover:text-black dark:hover:text-gray-300 transition-all duration-200"
        >
          <FaFileExport className="mr-2 text-sm" />
          Export CSV
        </CSVLink>
        <Pagination
          usersPerPage={usersPerPage}
          totalUsers={filteredUsers.length}
          paginate={handlePageChange}
          currentPage={currentPage}
        />
      </div>
      <div className="px-0 py-4">
        <div className="mt-12 border-t border-gray-300 dark:border-gray-700 pt-2">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
            <p>&copy; {new Date().getFullYear()} Secure MERN Stack. All rights reserved.</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-black dark:hover:text-gray-300">Support</a>
              <a href="#" className="hover:text-black dark:hover:text-gray-300">Privacy Policy</a>
              <a href="#" className="hover:text-black dark:hover:text-gray-300">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );  
};

export default UserList;
