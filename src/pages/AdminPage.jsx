import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig'; // Import Axios configuration
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaSpinner, FaRedo } from 'react-icons/fa';

const AdminPage = () => {
  const [loading, setLoading] = useState(true);
  const [scanStatus, setScanStatus] = useState(null);
  const [users, setUsers] = useState([]);
  const [reloadLoading, setReloadLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get('/auth/user', {
          withCredentials: true
        });

        if (userResponse.data.role !== 'admin') {
          navigate('/home');
        } else {
          fetchDailyScanStatus();
          fetchUsers();
        }
      } catch (error) {
        console.error('Error:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      setLoading(false);
      setUsers([]);
      setScanStatus(null);
    };
  }, [navigate]);

  const fetchDailyScanStatus = async () => {
    try {
      const response = await axios.get('/rss/check-daily-scan', {
        withCredentials: true
      });
      setScanStatus(response.data);
    } catch (error) {
      console.error('Error fetching scan status:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/admin/users', {
        withCredentials: true
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleReloadNews = async () => {
    setReloadLoading(true);
    try {
      await axios.post('/rss/reload', null, {
        withCredentials: true
      });
      setScanStatus({ message: 'News for today already reloaded.', scan: null });
    } catch (error) {
      console.error('Error reloading news:', error);
    } finally {
      setReloadLoading(false);
    }
  };

  const handleClearDailyScan = async () => {
    try {
      await axios.post('/rss/delete-daily-scan', {
        withCredentials: true
      });
      setScanStatus(null); // Update scan status after deletion
      window.location.reload(); // Refresh the page after successful deletion
    } catch (error) {
      console.error('Error clearing daily scan:', error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`/admin/user/${userToDelete}`, {
        withCredentials: true
      });
      setUsers(users.filter(user => user._id !== userToDelete));
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <FaSpinner className="animate-spin text-3xl text-gray-700 dark:text-gray-300" />
        <span className="ml-4 text-gray-700 dark:text-gray-300">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-4 sm:p-6 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100 text-center">
            Admin Dashboard
          </h2>

          {scanStatus?.message === 'No scan today. Reload news.' ? (
            <div className="mb-6 text-center">
              <button
                onClick={handleReloadNews}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center mx-auto"
                disabled={reloadLoading}
              >
                {reloadLoading ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : (
                  <>
                    <FaRedo className="mr-2" />
                    Reload Today&apos;s News
                  </>
                )}
              </button>
            </div>
          ) : scanStatus?.message === 'News for today already reloaded.' ? (
            <div className="mb-6 text-center">
              <div className="p-4 bg-green-100 text-green-700 rounded mb-2">
                News for today already reloaded
              </div>
              <button
                onClick={handleClearDailyScan}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center mx-auto mt-4"
              >
                Clear Today's Scan Record
              </button>
            </div>
          ) : null}

          <div className="mt-10">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4">Users</h3>
            {/* Wrap the table with a div to enable horizontal scrolling */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id} className="border-b dark:border-gray-600">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</td>
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300">{user.email}</td>
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300">{user.role}</td>
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300">
                        <button
                          onClick={() => {
                            setUserToDelete(user._id);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-600 transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
