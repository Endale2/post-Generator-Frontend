import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaRss, FaCog, FaUserShield, FaSignOutAlt } from 'react-icons/fa';
import axios from '../axiosConfig';  // Adjust this path according to your setup

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
    return `flex items-center justify-center space-x-4 p-4 rounded-lg transition duration-300 ease-in-out ${
      location.pathname === path
        ? 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-100'
        : 'hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-100'
    }`;
  };

  if (loading) {
    return (
      <div className="fixed inset-y-0 left-0 z-20 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 w-64 lg:w-72 shadow-lg mt-16 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-30 lg:static lg:inset-y-0 lg:z-auto">
      {/* Overlay for mobile drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 transition-transform transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 flex flex-col justify-between items-center space-y-8 h-full`}
      >
        <ul className="w-full space-y-6">
          <Link to="/home" className={getLinkClass('/home')} onClick={toggleSidebar}>
            <FaHome className="w-6 h-6" />
            <span>Home</span>
          </Link>
          <Link to="/rss" className={getLinkClass('/rss')} onClick={toggleSidebar}>
            <FaRss className="w-6 h-6" />
            <span>RSS Feed</span>
          </Link>
          {role === 'admin' && (
            <Link to="/admin" className={getLinkClass('/admin')} onClick={toggleSidebar}>
              <FaUserShield className="w-6 h-6" />
              <span>Admin</span>
            </Link>
          )}
          <Link to="/settings" className={getLinkClass('/settings')} onClick={toggleSidebar}>
            <FaCog className="w-6 h-6" />
            <span>Settings</span>
          </Link>
        </ul>
        <div className="w-full">
          <Link to="/logout" className={getLinkClass('/logout')} onClick={toggleSidebar}>
            <FaSignOutAlt className="w-6 h-6" />
            <span>Logout</span>
          </Link>
        </div>
      </aside>
    </div>
  );
};

export default SideBar;
