import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaRss, FaCog, FaUserShield, FaSignOutAlt } from 'react-icons/fa';
import axios from '../axiosConfig';

const SideBar = ({ isOpen, toggleSidebar }) => {
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get('/auth/user');
        setRole(response.data.role);
      } catch (error) {
        console.error('Error fetching user role:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  const getLinkClass = (path) => {
    return `flex items-center space-x-4 p-4 rounded-lg transition duration-300 ${
      location.pathname === path
        ? 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-100'
        : 'hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-100'
    }`;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 lg:hidden bg-black opacity-50 z-20" onClick={toggleSidebar}></div>
    );
  }

  return (
    <div>
      {/* Overlay for mobile drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 lg:hidden z-20"
          onClick={toggleSidebar}
        ></div>
      )}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 transition-transform transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 flex flex-col space-y-6`}
      >
        <ul className="flex flex-col space-y-6 lg:space-y-4">
          <Link to="/home" className={getLinkClass('/home')} onClick={toggleSidebar}>
            <FaHome className="w-6 h-6" />
            <span className="hidden lg:inline">Home</span>
          </Link>
          <Link to="/rss" className={getLinkClass('/rss')} onClick={toggleSidebar}>
            <FaRss className="w-6 h-6" />
            <span className="hidden lg:inline">RSS Feed</span>
          </Link>
          {role === 'admin' && (
            <Link to="/admin" className={getLinkClass('/admin')} onClick={toggleSidebar}>
              <FaUserShield className="w-6 h-6" />
              <span className="hidden lg:inline">Admin</span>
            </Link>
          )}
          <Link to="/settings" className={getLinkClass('/settings')} onClick={toggleSidebar}>
            <FaCog className="w-6 h-6" />
            <span className="hidden lg:inline">Settings</span>
          </Link>
          <Link to="/logout" className={getLinkClass('/logout')} onClick={toggleSidebar}>
            <FaSignOutAlt className="w-6 h-6" />
            <span className="hidden bg-red lg:inline">Logout</span>
          </Link>
        </ul>
      </aside>
    </div>
  );
};

export default SideBar;
