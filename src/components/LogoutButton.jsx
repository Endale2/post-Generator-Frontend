// src/components/LogoutButton.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import { logout } from '../features/userSlice';
import { FaSignOutAlt, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

const LogoutButton = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await axios.post('/auth/logout', {}, { withCredentials: true });
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      toast.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      <button
        onClick={handleLogout}
        className={`bg-red-600 text-white px-3 py-1 rounded flex items-center justify-center mx-auto transition-colors ${
          loading ? 'cursor-wait' : 'hover:bg-red-700'
        }`}
        disabled={loading}
      >
        {loading ? (
          <FaSpinner className="animate-spin text-lg mr-2" />
        ) : (
          <FaSignOutAlt className="text-lg mr-2" />
        )}
        {loading ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  );
};

export default LogoutButton;
