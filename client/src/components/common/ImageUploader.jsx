import React, { useState } from 'react';
import useImageUpload from '../../hooks/useImageUpload';

const ImageUploader = ({ onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const { upload, uploading, error } = useImageUpload();

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      try {
        const imageUrl = await upload(selectedFile);
        onUpload(imageUrl);
      } catch (err) {
        console.error('Image upload failed:', error);
      }
    }
  };

  return (
    <div className="mb-6">
      <input type="file" onChange={handleFileChange} className="mb-2" />
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-blue-600 text-white py-2 px-4 rounded mt-2"
      >
        {uploading ? 'Uploading...' : 'Upload Image'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default ImageUploader;
