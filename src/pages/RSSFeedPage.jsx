import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaTrashAlt, FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RSSFeedPage = () => {
  const [rssFeeds, setRssFeeds] = useState([]);
  const [newFeedUrl, setNewFeedUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [addingFeed, setAddingFeed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndFetchFeeds = async () => {
      try {
        await axios.get('/auth/user');
        await fetchRSSFeeds();
      } catch (error) {
        console.error('Error verifying token or fetching RSS feeds:', error);
        toast.error(error.response?.data?.message || 'Error verifying token or fetching RSS feeds.');
        navigate('/login');
      }
    };

    const fetchRSSFeeds = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/rss');
        if (Array.isArray(response.data)) {
          setRssFeeds(response.data);
        } else {
          console.error('Unexpected response format:', response.data);
          toast.error('Unexpected response format.');
        }
      } catch (error) {
        console.error('Error fetching RSS feeds:', error);
        toast.error(error.response?.data?.message || 'Error fetching RSS feeds.');
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchFeeds();
  }, [navigate]);

  const handleAddFeed = async (e) => {
    e.preventDefault();
    setAddingFeed(true);

    try {
      const response = await axios.post('/rss/add', { url: newFeedUrl });
      setRssFeeds([...rssFeeds, response.data.feed]);
      setNewFeedUrl('');
      toast.success('RSS feed added successfully.');
    } catch (error) {
      console.error('Error adding RSS feed:', error);
      toast.error(error.response?.data?.message || 'Error adding RSS feed.');
    } finally {
      setAddingFeed(false);
    }
  };

  const handleDeleteFeed = async (id) => {
    try {
      await axios.delete(`/rss/${id}`);
      setRssFeeds(rssFeeds.filter(feed => feed._id !== id));
      toast.success('RSS feed deleted successfully.');
    } catch (error) {
      console.error('Error deleting RSS feed:', error);
      toast.error(error.response?.data?.message || 'Error deleting RSS feed.');
    }
  };

  return (
    <div className="container mx-auto p-4 dark:bg-gray-900 dark:text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">RSS Feed Manager</h1>

      <form onSubmit={handleAddFeed} className="mb-8 flex flex-col items-center w-full space-y-4 sm:space-y-0 sm:flex-row sm:space-x-4">
        <input
          type="text"
          value={newFeedUrl}
          onChange={(e) => setNewFeedUrl(e.target.value)}
          placeholder="Enter RSS feed URL"
          className="border rounded px-4 py-3 w-full max-w-lg dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus
          focus:ring-blue-500 flex items-center justify-center"
          disabled={addingFeed}
        >
          {addingFeed ? (
            <FaSpinner className="animate-spin text-xl" />
          ) : (
            'Add RSS Feed'
          )}
        </button>
      </form>

      {loading ? (
        <div className="flex justify-center items-center">
          <FaSpinner className="text-4xl animate-spin" />
        </div>
      ) : (
        <ul className="space-y-4 max-w-3xl mx-auto">
          {rssFeeds.length > 0 ? (
            rssFeeds.map(feed => (
              <li key={feed._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-4 rounded-lg shadow-md dark:bg-gray-800">
                <div className="flex flex-col sm:flex-row items-start sm:items-center">
                  <span className="text-lg font-medium mb-2 sm:mb-0 sm:mr-4">{feed.url}</span>
                  {feed.valid ? (
                    <FaCheckCircle className="text-green-500 text-xl" title="Valid Feed" />
                  ) : (
                    <FaTimesCircle className="text-red-500 text-xl" title="Invalid Feed" />
                  )}
                </div>
                <button
                  onClick={() => handleDeleteFeed(feed._id)}
                  className="mt-2 sm:mt-0 text-red-600 hover:text-red-800 transition-colors dark:text-red-400 dark:hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <FaTrashAlt className="text-xl" />
                </button>
              </li>
            ))
          ) : (
            <p className="text-center text-lg">No RSS feeds available.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default RSSFeedPage;
