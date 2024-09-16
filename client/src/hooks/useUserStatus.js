import { useState, useEffect } from 'react';
import { getUserStatus, getActiveParticipantsCount } from '../services/userService';

const useUserStatus = () => {
  const [status, setStatus] = useState({
    isVerified: false,
    hasActiveProgram: false,
    hasActiveOneTimePayment: false,
    activeParticipantsCount: 0, // New state for active participants count
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        // Fetch user status and active participants count concurrently
        const [userStatus, activeParticipantsCount] = await Promise.all([
          getUserStatus(),
          getActiveParticipantsCount(),
        ]);

        // console.log('User Status from API:', userStatus); // Debugging log
        // console.log('Active Participants Count:', activeParticipantsCount); // Debugging log

        setStatus({
          isVerified: userStatus.isVerified,
          hasActiveProgram: userStatus.hasActiveProgram,
          hasActiveOneTimePayment: userStatus.hasActiveOneTimePayment,
          activeParticipantsCount, // Set the active participants count
        });
      } catch (err) {
        console.error('Error fetching user status or participants count:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  return { status, loading, error };
};

export default useUserStatus;
