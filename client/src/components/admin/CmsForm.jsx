import React, { useState } from 'react';
import axios from '../../utils/axiosInstance';

const CmsPageForm = ({ existingPage }) => {
  const [title, setTitle] = useState(existingPage?.title || '');
  const [content, setContent] = useState(existingPage?.content || '');
  const [route, setRoute] = useState(existingPage?.route || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await axios.post('/admin/cmsPages', { title, content, route });
      setSuccess('Page saved successfully!');
    } catch (error) {
      setError('Failed to save the page.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6 sm:px-6 lg:px-8 bg-white dark:bg-darkCard rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 text-center">
        {existingPage ? 'Edit Page' : 'Create New Page'}
      </h2>
      {error && <p className="text-red-500 dark:text-red-400 text-center mb-4">{error}</p>}
      {success && <p className="text-green-500 dark:text-green-400 text-center mb-4">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Page Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter page title"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent dark:bg-darkInput dark:border-gray-700 dark:text-gray-100"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Route</label>
          <input
            type="text"
            value={route}
            onChange={(e) => setRoute(e.target.value)}
            placeholder="e.g., '/about'"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent dark:bg-darkInput dark:border-gray-700 dark:text-gray-100"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter page content"
            className="w-full p-2 border rounded-lg h-40 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent dark:bg-darkInput dark:border-gray-700 dark:text-gray-100"
            required
          ></textarea>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className={`bg-teal-500 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-200 ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-teal-600 dark:hover:bg-teal-700'
            }`}
          >
            {loading ? 'Saving...' : 'Save Page'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CmsPageForm;
