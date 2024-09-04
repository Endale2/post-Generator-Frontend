import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { FaBars } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Navbar = ({ toggleSidebar }) => {
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
    <nav className="bg-white dark:bg-gray-800 dark:text-white p-4 flex justify-between items-center">
      {/* Hamburger Menu on the Left */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden block p-2 focus:outline-none"
        aria-label="Toggle sidebar"
      >
        <FaBars className="w-6 h-6 text-gray-800 dark:text-white" />
      </button>
      
      {/* Website Title */}
      <h1 className="text-xl font-bold">Posts Portal</h1>

      {/* Avatar Information */}
      {!loading && (
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-full flex items-center justify-center">
            {displayName[0].toUpperCase()}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
