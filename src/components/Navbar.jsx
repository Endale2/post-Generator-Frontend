// src/components/Navbar.jsx
import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import LogoutButton from './LogoutButton';
import Avatar from './Avatar';
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
    <div className="fixed top-0 left-0 right-0 z-30 bg-gray-200 dark:bg-gray-900 shadow-md">
      <div className="flex items-center justify-between p-4 max-w-screen-xl mx-auto">
        <button onClick={toggleSidebar} className="lg:hidden p-2 text-gray-800 dark:text-gray-100">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">Posts Portal</h1>
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
