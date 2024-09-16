import React, { useState } from 'react';
import { addUserInfo } from '../../../services/userService';
import { toast } from 'react-toastify';

const UserAddInfoForm = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addUserInfo({ name, age, gender });
      toast.success('Child information added successfully');
      onSuccess(); // Call onSuccess to proceed to payment
    } catch (error) {
      toast.error('Failed to add child information');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700 mb-2">Child Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-2">Age</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-2">Gender</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="flex justify-center mt-6">
        <button
          type="submit"
          disabled={loading}
          className="bg-teal-500 text-white px-4 py-2"
        >
          {loading ? 'Saving...' : 'Save and Continue'}
        </button>
      </div>
    </form>
  );
};

export default UserAddInfoForm;
