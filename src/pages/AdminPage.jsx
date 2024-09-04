import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig'; // Import Axios configuration
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaSpinner, FaRedo } from 'react-icons/fa';
import { toast } from 'react-toastify';

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
      await axios.delete('/rss/delete-daily-scan', {
        withCredentials: true
      });

      await axios.post('/rss/reload', null, {
        withCredentials: true
      });

      toast.success('News reloaded successfully!');
      setScanStatus({ message: 'News for today already reloaded.', scan: null });
    } catch (error) {
      console.error('Error reloading news:', error);
      toast.error('Failed to reload news.');
    } finally {
      setReloadLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await axios.delete(`/admin/user/${userToDelete._id}`, {
        withCredentials: true
      });
      setUsers(users.filter(user => user._id !== userToDelete._id));
      toast.success('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user.');
    } finally {
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const confirmDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
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
            </div>
          ) : null}

          <div className="mt-10">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4">Users</h3>
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
                          onClick={() => confirmDeleteUser(user)}
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h4 className="text-lg font-bold mb-4">Confirm Delete</h4>
            <p className="mb-6">Are you sure you want to delete {userToDelete.name}?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200 px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
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
