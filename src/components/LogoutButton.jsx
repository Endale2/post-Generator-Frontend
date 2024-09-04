import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

const LogoutButton = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);
    try {
      // Remove token from local storage
      localStorage.removeItem('accessToken');

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
      className="text-red-500 hover:text-red-600 p-2 rounded-full flex items-center justify-center"
      disabled={loading}
      aria-label="Logout"
    >
      {loading ? <FaSpinner className="animate-spin" size={20} /> : <FaSignOutAlt size={20} />}
    </button>
  );
};

export default LogoutButton;
