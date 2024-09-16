import React, { useState, useEffect } from 'react';
import { createUser, updateUser } from '../../services/userService';
import { toast } from 'react-toastify';

const UserForm = ({ user, onCancel, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    role: 'user',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        password: '', // Clear password field when editing
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (user) {
        const updatedUser = { ...formData };
        if (!updatedUser.password) delete updatedUser.password; // Do not send password if it's not updated
        await updateUser(user._id, updatedUser);
        toast.success('User updated successfully');
      } else {
        await createUser(formData);
        toast.success('User created successfully');
      }
      onSave();
    } catch (error) {
      console.error('Failed to save user:', error);
      toast.error('Failed to save user');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 w-full sm:px-6 lg:px-8 bg-white dark:bg-darkCard rounded-lg shadow-md">
      <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-100">
        {user ? 'Edit User' : 'Create New User'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent dark:bg-darkInput dark:border-gray-700 dark:text-gray-100"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent dark:bg-darkInput dark:border-gray-700 dark:text-gray-100"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent dark:bg-darkInput dark:border-gray-700 dark:text-gray-100"
            required
          />
        </div>
        {!user && (
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent dark:bg-darkInput dark:border-gray-700 dark:text-gray-100"
              required
            />
          </div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent dark:bg-darkInput dark:border-gray-700 dark:text-gray-100"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="flex justify-between mt-6">
          <button
            type="submit"
            className="bg-teal-500 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-teal-400 dark:bg-teal-600 dark:hover:bg-teal-700"
          >
            {user ? 'Update User' : 'Create User'}
          </button>
          <button
            type="button"
            className="bg-gray-500 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
