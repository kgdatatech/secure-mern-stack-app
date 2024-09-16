import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import { useParams, Navigate } from 'react-router-dom'; // Import Navigate for redirect
import NotFound from './NotFound'; // Ensure NotFound component is imported

const DynamicPage = () => {
  const { route } = useParams();
  const [pageContent, setPageContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add a loading state
  const [notFound, setNotFound] = useState(false); // Add a state for 404

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await axios.get(`/cmsPages/${route}`);
        setPageContent(response.data);
      } catch (error) {
        console.error('Error fetching page:', error);
        setNotFound(true); // Set the 404 state
      } finally {
        setIsLoading(false); // Set loading to false once request completes
      }
    };
    fetchPage();
  }, [route]);

  if (isLoading) return <div>Loading...</div>;

  if (notFound) return <NotFound />; // Render 404 component if page not found

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">{pageContent?.title}</h1>
      <div className="mt-4">{pageContent?.content}</div>
    </div>
  );
};

export default DynamicPage;
