import axiosInstance from '../utils/axiosInstance';

// Fetch CMS content for a specific page
export const getContent = async (page) => {
  try {
    const response = await axiosInstance.get(`/admin/cms/content/${page}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update CMS content for a specific page
export const updateContent = async (page, content) => {
  try {
    const response = await axiosInstance.put(`/admin/cms/content/${page}`, { content });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch styles for a specific page
export const getStyles = async (page) => {
  try {
    const response = await axiosInstance.get(`/admin/cms/styles/${page}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update styles for a specific page
export const updateStyles = async (page, styles) => {
  try {
    const response = await axiosInstance.put(`/admin/cms/styles/${page}`, { styles });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Upload image for CMS content
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await axiosInstance.post('/admin/cms/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch specific dynamic content by route and key
export const fetchDynamicContent = async (route, key) => {
  try {
    const response = await axiosInstance.get(`/admin/cms/content/${route}/${key}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update specific dynamic content by route and key
export const updateDynamicContent = async (route, key, value) => {
  try {
    const response = await axiosInstance.post(`/admin/cms/content/${route}/${key}`, { value });
    return response.data;
  } catch (error) {
    throw error;
  }
};
