import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import LogoutButton from './LogoutButton';
import Avatar from './Avatar';
import { toast } from 'react-toastify';
import { FaBars } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io'; // X Icon
import MenuBar from './MenuBar';

const Navbar = ({ toggleSidebar, darkMode, toggleDarkMode }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

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

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-30 bg-gray-200 dark:bg-gray-900 shadow-md">
      <div className="flex items-center justify-between p-4 max-w-screen-xl mx-auto">
        {/* Toggle Drawer Button for Small Screens */}
        <button onClick={toggleDrawer} className="lg:hidden p-2 text-gray-800 dark:text-gray-100">
          <FaBars size={22} />
        </button>

        <h1 className="text-xl font-bold text-gray-800 dark:text-white">Posts Portal</h1>

        <div className="relative flex items-center">
          {/* Avatar with Dropdown */}
          <Avatar name={displayName} onClick={toggleDropdown} className="cursor-pointer" />

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50">
              <div className="px-4 py-2 text-gray-800 dark:text-white">
                {displayName}
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700"></div>
              <div className="px-4 py-2">
                <LogoutButton />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Drawer for smaller screens */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-40 bg-gray-900 bg-opacity-75">
          <div className="fixed inset-y-0 left-0 bg-gray-100 dark:bg-gray-900 p-6 w-64 shadow-lg z-50">
            {/* Close Drawer Button */}
            <button onClick={toggleDrawer} className="text-gray-900 dark:text-gray-100 p-2">
              <IoMdClose size={24} />
            </button>

            {/* Menu Bar */}
            <MenuBar />
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
