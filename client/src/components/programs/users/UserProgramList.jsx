import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axiosInstance';
import { FaClipboardList } from 'react-icons/fa';
import { FaLock } from 'react-icons/fa'; // Secure icon for program titles
import { toast } from 'react-toastify';
import LoadingSpinner from '../../common/LoadingSpinner';
import useAuthProvider from '../../../hooks/useAuthProvider';
import useUserStatus from '../../../hooks/useUserStatus';
import Modal from 'react-modal'; // Import Modal
import UserAddInfoForm from './UserAddInfoForm'; // Import the UserUserForm component

Modal.setAppElement('#root'); // Set the root element for accessibility

const UserProgramList = () => {
  const { auth } = useAuthProvider();
  const isUser = auth?.user?.role === 'user';

  const { status, loading: statusLoading } = useUserStatus();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [showUserFormModal, setShowUserFormModal] = useState(false); // State to control the modal visibility
  const [selectedProgram, setSelectedProgram] = useState(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axiosInstance.get('/programs');
        setPrograms(response.data.data || []);
      } catch (err) {
        setError(err.response?.data?.error || 'Something went wrong');
        toast.error('Failed to load programs');
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const toggleReadMore = (id) => {
    setExpanded((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  // Function to render the program description
  const renderDescription = (program) => {
    const description = program.description;
    const isExpanded = expanded[program._id];
    const maxLength = 100; // Maximum number of characters to show before truncating

    if (description.length <= maxLength) {
      return <p className="text-sm text-gray-600 mb-4">{description}</p>;
    }

    return (
      <p className="text-sm text-gray-600 mb-4">
        {isExpanded ? description : `${description.substring(0, maxLength)}...`}
        <span
          className="text-blue-500 cursor-pointer ml-2"
          onClick={() => toggleReadMore(program._id)}
        >
          {isExpanded ? 'Show Less' : 'Read More'}
        </span>
      </p>
    );
  };

  const handlePayment = (program, type) => {
    setSelectedProgram({ ...program, type });
    setShowUserFormModal(true);
  };

  const handleUserFormSuccess = () => {
    setShowUserFormModal(false);
    if (selectedProgram.type === 'one-time') {
      handleOneOffPayment();
    } else if (selectedProgram.type === 'subscription') {
      handleSubscription();
    }
  };

  const handleOneOffPayment = async () => {
    try {
      const response = await axiosInstance.post('/payment/create-payment-intent', {
        userId: auth.user._id,
        priceId: 'price_ID',
      });
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Error initiating one-off payment:', error);
      toast.error('An error occurred while processing your payment.');
    }
  };

  const handleSubscription = async () => {
    try {
      const response = await axiosInstance.post('/subscription/create', {
        userId: auth.user._id,
        priceId: 'price_ID',
      });
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Error initiating subscription:', error);
      toast.error('An error occurred while creating your subscription.');
    }
  };

  if (loading || statusLoading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-grow w-full px-6 py-8 sm:px-10 bg-white shadow-lg rounded-lg">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center">
            <FaClipboardList className="mr-2" />
            Available Programs
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Explore our range of programs designed to cater to all skill levels. Whether you're a beginner looking to get started or an advanced player aiming to refine your skills, you'll find the right program here. Join us and take the next step in your full stack journey.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {programs.map((program) => (
            <div
              key={program._id}
              className="p-6 bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
            >
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
                  <FaLock className="mr-2 text-indigo-600" />
                  {program.name}
                </h2>
                <p className="text-sm text-gray-700 mb-1">
                  Location: {program.location} {/* Display the location */}
                </p>
                <p className="text-sm text-gray-700 mb-1">
                  Age Group: {program.ageGroup}
                </p>
                {/* {renderDescription(program)} */}
                <p className="text-sm text-gray-700 mb-1">
                  Duration: {program.duration}
                </p>
                <p className="text-sm text-gray-700 mb-1">
                  Start Date:{' '}
                  {new Date(program.startDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-700 mb-1">
                  End Date: {new Date(program.endDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-700 mb-1">
                  Class Size: {program.classSize}
                </p>
                <p className="text-lg font-semibold text-indigo-700 mb-4">
                  Cost: ${program.cost}
                </p>
                {renderDescription(program)}
              </div>
              {isUser && (
                <div className="mt-4">
                  <button
                    onClick={() => handlePayment(program, 'one-time')}
                    className="w-full border-2 border-lime-600 text-lime-600 rounded-md py-2 px-4 mb-2 flex justify-center items-center hover:bg-lime-600 hover:text-white transition-all duration-200"
                    disabled={loading}
                  >
                    Register One-Time
                  </button>
                  <button
                    onClick={() => handlePayment(program, 'subscription')}
                    className="w-full border-2 border-indigo-600 text-indigo-600 rounded-md py-2 px-4 flex justify-center items-center hover:bg-indigo-600 hover:text-white transition-all duration-200"
                    disabled={loading}
                  >
                    Subscribe Monthly
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <Modal
          isOpen={showUserFormModal}
          onRequestClose={() => setShowUserFormModal(false)}
          contentLabel="User Information Form"
          style={{
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
            },
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
          }}
        >
          <h2 className="text-center text-2xl font-bold mb-4">
            Enter User Information
          </h2>
          <UserAddInfoForm onSuccess={handleUserFormSuccess} />
        </Modal>

        <div className="mt-12 border-t border-gray-300 pt-4">
          <div className="flex justify-between text-xs text-gray-600">
            <p>
              &copy; {new Date().getFullYear()} Secure MERN Stack. All rights
              reserved.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-black">
                Support
              </a>
              <a href="#" className="hover:text-black">
                Privacy
              </a>
              <a href="#" className="hover:text-black">
                Terms
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProgramList;
