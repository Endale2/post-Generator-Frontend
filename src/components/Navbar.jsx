import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig'; // Import your Axios instance
import LogoutButton from './LogoutButton';
import Avatar from './Avatar';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/auth/user');
        setUser(response.data);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to load user data.');
        toast.error('Failed to load user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  

  const displayName = user ? user.name || user.email.split('@')[0] : 'User';

  return (
    <div className="fixed top-0 left-0 right-0 z-30 bg-gray-200 dark:bg-gray-900 shadow-md">
      <div className="flex items-center justify-between p-4 max-w-screen-xl mx-auto">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">News Portal</h1>
        <div className="flex items-center">
          <Avatar name={displayName} />
          <span className="text-gray-800 dark:text-white mr-4 ml-2">
            {loading ? 'Loading...' : displayName || error}
          </span>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
