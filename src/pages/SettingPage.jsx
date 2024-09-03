import React, { useState, useEffect } from 'react';
import { FaCog, FaSave, FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig'; // Import Axios configuration
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SettingsPage = () => {
  const [context, setContext] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndFetchSetting = async () => {
      try {
        // Fetch user data to verify authentication
        await axios.get('/auth/user');
        
        // Fetch settings
        fetchSetting();
      } catch (error) {
        console.error('Error verifying token or fetching setting:', error);
        toast.error('Error verifying token or fetching setting.');
        navigate('/login'); // Redirect to login if authentication fails
      }
    };

    const fetchSetting = async () => {
      try {
        const response = await axios.get('/setting');
        if (response.data && response.data.context) {
          setContext(response.data.context);
        } else {
          setContext('Default Setting');
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching setting:', error);
        toast.error('Error fetching setting.');
        setIsLoading(false);
      }
    };

    checkAuthAndFetchSetting();
  }, [navigate]);

  const handleUpdateSetting = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/setting/update', { context });
      setMessage('Setting updated successfully!');
      toast.success('Setting updated successfully.');
    } catch (error) {
      console.error('Error updating setting:', error);
      setMessage('Failed to update setting.');
      toast.error('Failed to update setting.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 dark:from-gray-800 dark:to-gray-900 p-6 flex flex-col items-center justify-center">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center justify-center">
          <FaCog className="mr-2 text-blue-500 dark:text-blue-300" />
          Settings Page
        </h1>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <FaSpinner className="animate-spin text-4xl text-gray-600 dark:text-gray-400 mb-4" />
            <p className="text-center text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        ) : (
          <form onSubmit={handleUpdateSetting}>
            <label htmlFor="context" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Setting
            </label>
            <input
              type="text"
              id="context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              placeholder="Enter new setting context"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white dark:bg-blue-500 dark:hover:bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <FaSave className="mr-2" />
              Save Setting
            </button>
            {message && (
              <p className={`mt-4 text-center ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
                {message}
              </p>
            )}
          </form>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default SettingsPage;
