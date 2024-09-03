// src/components/Navbar.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, logout } from '../features/userSlice';
import LogoutButton from './LogoutButton';
import Avatar from './Avatar';
import { toast } from 'react-toastify';

const Navbar = () => {
  const dispatch = useDispatch();
  const { name, email, status } = useSelector((state) => state.user);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUser());
    }
  }, [dispatch, status]);

  const displayName = name || email.split('@')[0];

  return (
    <div className="fixed top-0 left-0 right-0 z-30 bg-gray-200 dark:bg-gray-900 shadow-md">
      <div className="flex items-center justify-between p-4 max-w-screen-xl mx-auto">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">News Portal</h1>
        <div className="flex items-center">
          <Avatar name={displayName} />
          <span className="text-gray-800 dark:text-white mr-4 ml-2">
            {status === 'loading' ? 'Loading...' : displayName || 'Error loading name'}
          </span>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
