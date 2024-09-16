import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { FaEdit, FaTrashAlt, FaClone, FaPlus, FaClipboardList, FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import LoadingSpinner from '../common/LoadingSpinner';
import ProgramForm from './ProgramForm';
import RosterList from './RosterList';

const ProgramList = ({
  onSelectProgram,
  onDeleteProgram,
  onDuplicateProgram,
}) => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axiosInstance.get('/programs');
        setPrograms(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response ? err.response.data.error : 'Something went wrong');
        setLoading(false);
        toast.error('Failed to load programs');
      }
    };

    fetchPrograms();
  }, []);

  const handleCreateProgram = () => {
    setEditingProgram(null);
    setIsProgramModalOpen(true);
  };

  const handleSaveProgram = (savedProgram) => {
    if (editingProgram) {
      setPrograms((prevPrograms) =>
        prevPrograms.map((program) =>
          program._id === savedProgram._id ? savedProgram : program
        )
      );
    } else {
      setPrograms([...programs, savedProgram]);
    }
    setIsProgramModalOpen(false);
  };

  const [expanded, setExpanded] = useState({});

  const toggleReadMore = (id) => {
    setExpanded((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const renderDescription = (program) => {
    const description = program.description;
    const isExpanded = expanded[program._id];
    const maxLength = 100;

    if (description.length <= maxLength) {
      return <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{description}</p>;
    }

    return (
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {isExpanded ? description : `${description.substring(0, maxLength)}...`}
        <span
          className="text-blue-500 dark:text-blue-400 cursor-pointer ml-2"
          onClick={() => toggleReadMore(program._id)}
        >
          {isExpanded ? 'Show Less' : 'Read More'}
        </span>
      </p>
    );
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500 dark:text-red-400">{error}</p>;

  return (
    <div className="flex flex-col min-h-screen pt-8 pb-24 dark:bg-darkBackground">
      <div className="flex-grow w-full px-4 py-6 sm:px-8 bg-gray-100 dark:bg-darkBackground">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h1 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-gray-100 border-b border-gray-300 dark:border-gray-700 pt-6 flex items-center">
            <FaClipboardList className="mr-2" />
            Create a Program
          </h1>
          <button
            className="bg-transparent text-black dark:text-white rounded h-10 sm:h-12 py-2 px-4 flex items-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
            onClick={handleCreateProgram}
          >
            <FaPlus className="mr-2" />
            Add New Program
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {programs.map((program) => (
            <div
              key={program._id}
              className="p-4 bg-white dark:bg-darkCard border border-gray-200 dark:border-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:scale-105"
            >
              <div className="flex justify-center mb-4">
                <FaLock className="text-4xl text-yellow-400" /> {/* Soccer icon as a centered "image" */}
              </div>
              <div>
                <h2 className="text-md sm:text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">{program.name}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Location: {program.location}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Age Group: {program.ageGroup}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Duration: {program.duration}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Start Date: {new Date(program.startDate).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">End Date: {new Date(program.endDate).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Class Size: {program.classSize}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Cost: ${program.cost}</p>
                {renderDescription(program)}
              </div>
              <div className="mt-4 border-t dark:border-gray-700 pt-4 flex justify-between items-center">
                <FaEdit
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors duration-200"
                  onClick={() => {
                    onSelectProgram(program);
                    setEditingProgram(program);
                    setIsProgramModalOpen(true);
                  }}
                />
                <FaClone
                  className="text-gray-500 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 cursor-pointer transition-colors duration-200"
                  onClick={() => onDuplicateProgram(program)}
                />
                <FaTrashAlt
                  className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 cursor-pointer transition-colors duration-200"
                  onClick={() => onDeleteProgram(program._id)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Roster List */}
        <div>
          <h1 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-gray-100 border-b border-gray-300 dark:border-gray-700 pt-12 flex items-center">
            Program Details
          </h1>
          <RosterList />
        </div>

        {/* Footer */}
        <div className="px-0 py-4">
          <div className="mt-12 border-t border-gray-300 dark:border-gray-700 pt-2">
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
              <p>&copy; {new Date().getFullYear()} Secure MERN Stack. All rights reserved.</p>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-black dark:hover:text-gray-300">Support</a>
                <a href="#" className="hover:text-black dark:hover:text-gray-300">Privacy</a>
                <a href="#" className="hover:text-black dark:hover:text-gray-300">Terms</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ProgramForm for creating/editing a program */}
      <ProgramForm
        program={editingProgram}
        onSave={handleSaveProgram}
        isOpen={isProgramModalOpen}
        onRequestClose={() => setIsProgramModalOpen(false)}
      />
    </div>
  );
};

export default ProgramList;
