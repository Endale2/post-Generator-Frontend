import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../features/userSlice';

const HomePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Dispatch fetchUser action
        await dispatch(fetchUser()).unwrap();
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [dispatch]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (user.status === 'failed') {
    return <div className="text-center text-red-600">Failed to load user data. {user.error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user.name || 'User'}!</h1>
        <p className="mb-2">Email: {user.email}</p>
        <p className="mb-4">Role: {user.role}</p>
      </div>
    </div>
  );
};

export default HomePage;
