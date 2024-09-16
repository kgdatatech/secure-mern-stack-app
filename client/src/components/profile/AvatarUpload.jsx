import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';

const AvatarUpload = ({ avatar, onAvatarChange, onAvatarRemove }) => {
  const [preview, setPreview] = useState(avatar);

  useEffect(() => {
    setPreview(avatar);
  }, [avatar]);

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);

      try {
        const response = await axiosInstance.post('/user/profile/avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setPreview(response.data.avatar);
        onAvatarChange(response.data.avatar);
        toast.success('Avatar updated successfully!');
      } catch (error) {
        toast.error('Error updating avatar');
        console.error(error);
      }
    }
  };

  const handleRemove = async () => {
    try {
      await axiosInstance.post('/user/profile/avatar', { avatar: null });
      setPreview(null);
      onAvatarRemove();
      toast.success('Avatar removed successfully!');
    } catch (error) {
      toast.error('Error removing avatar');
      console.error(error);
    }
  };

  return (
    <div className="text-center mb-8">
      <img
        src={preview || 'https://via.placeholder.com/150'}
        alt="Avatar"
        className="w-32 h-32 rounded-full mx-auto object-cover"
      />
      <input
        type="file"
        accept="image/*"
        className="mt-4 hidden"
        id="avatarUpload"
        onChange={handleChange}
      />
      <label htmlFor="avatarUpload" className="text-blue-500 cursor-pointer hover:underline block">
        Change Avatar
      </label>
      {preview && (
        <button
          type="button"
          className="mt-2 text-red-500 hover:underline"
          onClick={handleRemove}
        >
          <FaTrash className="inline-block mr-2" /> Remove Avatar
        </button>
      )}
    </div>
  );
};

export default AvatarUpload;
