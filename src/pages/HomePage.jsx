import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig'; // Import the Axios instance

const HomePage = () => {
  const [user, setUser] = useState(null); // Local state for user data
  const [loading, setLoading] = useState(true); // Local state for loading
  const [error, setError] = useState(null); // Local state for error

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/auth/user'); // Fetch user data
        setUser(response.data); // Set user data
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to load user data.'); // Set error message
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">Failed to load user data. {error}</div>;
  }

  if (!user) {
    return <div className="text-center">No user data available.</div>;
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
