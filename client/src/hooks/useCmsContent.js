import { useState, useEffect } from 'react';
import { 
  getContent, 
  updateContent, 
  fetchDynamicContent, 
  updateDynamicContent 
} from '../services/cmsService';

const useCmsContent = (type, key = null) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      console.log('Fetching content for:', type, key ? `with key: ${key}` : ''); // Debugging log
      try {
        let data;
        if (key) {
          // Fetch specific dynamic content if key is provided
          data = await fetchDynamicContent(type, key);
          setContent(data.value);
        } else {
          // Fetch full-page content if no key is provided
          data = await getContent(type);
          setContent(data.sections); // Make sure this aligns with your API response
        }
        console.log('Fetched content:', data); // Debugging log
      } catch (err) {
        console.error('Error fetching content:', err); // Log any errors
        setError(err.message || 'Error fetching content');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [type, key]);

  const saveContent = async (newContent) => {
    setLoading(true);
    try {
      let updatedContent;
      if (key) {
        // Update specific dynamic content if key is provided
        updatedContent = await updateDynamicContent(type, key, newContent);
        setContent(updatedContent.value);
      } else {
        // Update full-page content if no key is provided
        updatedContent = await updateContent(type, newContent);
        setContent(updatedContent.sections);
      }
    } catch (err) {
      console.error('Error saving content:', err); // Log any errors
      setError(err.message || 'Error saving content');
    } finally {
      setLoading(false);
    }
  };

  return { content, loading, error, saveContent };
};

export default useCmsContent;
