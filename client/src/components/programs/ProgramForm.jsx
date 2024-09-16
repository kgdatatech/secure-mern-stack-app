import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import Modal from 'react-modal';
import { toast } from 'react-toastify';

Modal.setAppElement('#root');

const ProgramForm = ({ program, onSave, isOpen, onRequestClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [cost, setCost] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [classSize, setClassSize] = useState('');
  const [location, setLocation] = useState(''); // New location 
  const [imageUrl, setImageUrl] = useState(''); // New field for the image URL
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (program) {
      setName(program.name);
      setDescription(program.description);
      setDuration(program.duration);
      setStartDate(program.startDate.split('T')[0]);
      setEndDate(program.endDate.split('T')[0]);
      setCost(program.cost);
      setAgeGroup(program.ageGroup); 
      setClassSize(program.classSize); 
      setLocation(program.location); // Set location when editing
      setImageUrl(program.imageUrl); // Set image URL
    } else {
      setName('');
      setDescription('');
      setDuration('');
      setStartDate('');
      setEndDate('');
      setCost('');
      setAgeGroup('');
      setClassSize('');
      setLocation(''); // Reset location when creating new
      setImageUrl(''); // Reset image URL
    }
  }, [program]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = program
        ? await axiosInstance.put(`/programs/${program._id}`, { name, description, duration, startDate, endDate, cost, ageGroup, classSize, location })
        : await axiosInstance.post('/programs', { name, description, duration, startDate, endDate, cost, ageGroup, classSize, location });
      onSave(response.data.data);
      onRequestClose();
      setLoading(false);
      toast.success('Program saved successfully');
    } catch (err) {
      setError(err.response ? err.response.data.error : 'Something went wrong');
      setLoading(false);
      toast.error('Failed to save program');
    }
  };

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '90%',
      maxWidth: '600px',
      padding: '20px',
      borderRadius: '10px',
      backgroundColor: 'white', // Ensure background in light mode
    },
    overlay: {
      backgroundColor: 'rgba(3, 6, 9, 0.50)', // Dark semi-transparent overlay
    },
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
    >
      <div className="p-8 bg-white dark:bg-darkCard rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
          {program ? 'Edit Program' : 'Create Program'}
        </h1>
        {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-2 border rounded dark:bg-darkInput dark:border-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Age Group</label>
              <input
                type="text"
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                required
                className="w-full p-2 border rounded dark:bg-darkInput dark:border-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full p-2 border rounded dark:bg-darkInput dark:border-gray-700 dark:text-gray-100"
              ></textarea>
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
                className="w-full p-2 border rounded dark:bg-darkInput dark:border-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full p-2 border rounded dark:bg-darkInput dark:border-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full p-2 border rounded dark:bg-darkInput dark:border-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Class Size</label>
              <input
                type="number"
                value={classSize}
                onChange={(e) => setClassSize(e.target.value)}
                required
                className="w-full p-2 border rounded dark:bg-darkInput dark:border-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Cost</label>
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                required
                className="w-full p-2 border rounded dark:bg-darkInput dark:border-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full p-2 border rounded dark:bg-darkInput dark:border-gray-700 dark:text-gray-100"
              />
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={onRequestClose}
              className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 mr-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-teal-500 dark:bg-teal-700 text-white px-4 py-2 rounded"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ProgramForm;
