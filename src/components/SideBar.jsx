import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from '../axiosConfig';
import { FaHome, FaRss, FaCog, FaUserShield, FaBars, FaTimes } from 'react-icons/fa';

const SideBar = () => {
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get('/auth/user');
        setRole(response.data.role);
      } catch (error) {
        console.error('Error fetching user role:', error);
        // Handle error appropriately
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  const getLinkClass = (path) => {
    return `flex items-center space-x-3 p-3 rounded-lg transition duration-300 ease-in-out ${
      location.pathname === path
        ? 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-100'
        : 'hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-100'
    }`;
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  if (loading) {
    return (
      <div className="fixed inset-y-0 left-0 z-20 bg-gray-100 dark:bg-gray-900 p-6 w-64 lg:w-72 shadow-lg mt-16">
        <div className="flex flex-col mt-6 space-y-4">
          {/* Loading indicator */}
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hamburger Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-30 p-2 rounded-md bg-gray-100 dark:bg-gray-900"
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-20 bg-gray-100 dark:bg-gray-900 p-6 w-64 lg:w-72 shadow-lg mt-16 transition-transform transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:mt-0`}
      >
        <div className="flex flex-col mt-6 space-y-4">
          <Link to="/home" className={getLinkClass('/home')}>
            <FaHome size={22} />
            <span className="text-lg font-medium">Home</span>
          </Link>
          <Link to="/rss" className={getLinkClass('/rss')}>
            <FaRss size={22} />
            <span className="text-lg font-medium">RSS Feed</span>
          </Link>

          {role === 'admin' && (
            <Link to="/admin" className={getLinkClass('/admin')}>
              <FaUserShield size={22} />
              <span className="text-lg font-medium">Admin</span>
            </Link>
          )}
          <Link to="/settings" className={getLinkClass('/settings')}>
            <FaCog size={22} />
            <span className="text-lg font-medium">Settings</span>
          </Link>
        </div>
      </div>

      {/* Overlay for smaller screens */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black opacity-50 z-10 lg:hidden"
        ></div>
      )}
    </div>
  );
};

export default SideBar;
