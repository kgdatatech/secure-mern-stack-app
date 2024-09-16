// src/hooks/useImageUpload.js

import { useState } from 'react';
import { uploadImage } from '../services/cmsService';

const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const upload = async (file) => {
    setUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      setUploading(false);
      return imageUrl;
    } catch (err) {
      setError(err.message);
      setUploading(false);
      throw err;
    }
  };

  return { upload, uploading, error };
};

export default useImageUpload;
