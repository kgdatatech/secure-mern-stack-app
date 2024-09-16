import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosInstance';
import LoadingSpinner from '../../common/LoadingSpinner';

const UserProgramDetail = () => {
  const { id } = useParams();
  const [program, setProgram] = useState(null); // Initialize as null for better control
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const response = await axiosInstance.get(`/programs/${id}`);
        setProgram(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response ? err.response.data.error : 'Something went wrong');
        setLoading(false);
      }
    };

    fetchProgram();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  if (!program) return <p className="text-gray-600">Program not found.</p>;

  return (
    <div className="flex flex-col min-h-screen pt-8 pb-24">
      <div className="flex-grow w-full px-4 py-6 sm:px-8 bg-gray-100">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{program.name}</h1>
          <p className="text-md text-gray-600 mb-4">{program.description}</p>
          <p className="text-sm text-gray-600 mb-2">Duration: {program.duration}</p>
          <p className="text-sm text-gray-600 mb-2">Start Date: {new Date(program.startDate).toLocaleDateString()}</p>
          <p className="text-sm text-gray-600 mb-2">End Date: {new Date(program.endDate).toLocaleDateString()}</p>
          <p className="text-sm text-gray-600 mb-4">Cost: ${program.cost}</p>

          {/* Button to initiate registration or inquiry */}
          <button
            className="bg-blue-600 text-white rounded py-2 px-4 hover:bg-blue-700 transition-all duration-200"
            onClick={() => alert('Registration form or inquiry modal would appear here')}
          >
            Register or Inquire
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProgramDetail;
