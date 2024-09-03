import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import { FaSignOutAlt, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

const LogoutButton = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);
    try {
      
      // Remove token from local storage
      localStorage.removeItem('accessToken');

      // Clear user data from Redux store
      dispatch(logout());

      // Redirect to login page after logout
      navigate('/login');

      // Notify user of successful logout
      toast.success('Successfully logged out');
    } catch (error) {
      toast.error('Logout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 flex items-center justify-center"
      disabled={loading}
    >
      {loading ? <FaSpinner className="animate-spin mr-2" /> : <FaSignOutAlt className="mr-2" />}
      Logout
    </button>
  );
};

export default LogoutButton;
