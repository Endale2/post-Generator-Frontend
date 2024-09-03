import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Import useDispatch and useSelector
import { FaCheckCircle, FaTimesCircle, FaTrashAlt, FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchUser } from '../features/userSlice'; // Import fetchUser

const RSSFeedPage = () => {
  const [rssFeeds, setRssFeeds] = useState([]);
  const [newFeedUrl, setNewFeedUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize useDispatch
  const user = useSelector((state) => state.user); // Access user state

  useEffect(() => {
    const checkAuthAndFetchFeeds = async () => {
      try {
        // Fetch user data from Redux
        await dispatch(fetchUser()).unwrap();
        
        // Fetch RSS feeds
        fetchRSSFeeds();
      } catch (error) {
        console.error('Error verifying token or fetching RSS feeds:', error);
        toast.error('Error verifying token or fetching RSS feeds.');
      }
    };

    const fetchRSSFeeds = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/rss', {
          withCredentials: true
        });
        if (Array.isArray(response.data)) {
          setRssFeeds(response.data);
        } else {
          console.error('Unexpected response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching RSS feeds:', error);
        toast.error('Error fetching RSS feeds.');
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchFeeds();
  }, [dispatch, navigate]);

  const handleAddFeed = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/rss/add', { url: newFeedUrl }, {
        withCredentials: true
      });
      setRssFeeds([...rssFeeds, response.data.feed]);
      setNewFeedUrl('');
      toast.success('RSS feed added successfully.');
    } catch (error) {
      console.error('Error adding RSS feed:', error);
      toast.error('Error adding RSS feed.');
    }
  };

  const handleDeleteFeed = async (id) => {
    try {
      await axios.delete(`/rss/${id}`, {
        withCredentials: true
      });
      setRssFeeds(rssFeeds.filter(feed => feed._id !== id));
      toast.success('RSS feed deleted successfully.');
    } catch (error) {
      console.error('Error deleting RSS feed:', error);
      toast.error('Error deleting RSS feed.');
    }
  };

  return (
    <div className="container mx-auto p-4 dark:bg-gray-900 dark:text-white min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8 text-center">RSS Feed Manager</h1>

      <form onSubmit={handleAddFeed} className="mb-8 flex flex-col items-center w-full">
        <input
          type="text"
          value={newFeedUrl}
          onChange={(e) => setNewFeedUrl(e.target.value)}
          placeholder="Enter RSS feed URL"
          className="border rounded px-4 py-3 mb-4 w-full max-w-lg dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add RSS Feed
        </button>
      </form>

      {loading ? (
        <div className="flex justify-center items-center">
          <FaSpinner className="text-4xl animate-spin" />
        </div>
      ) : (
        <ul className="space-y-4 max-w-3xl mx-auto">
          {Array.isArray(rssFeeds) && rssFeeds.length > 0 ? (
            rssFeeds.map(feed => (
              <li key={feed._id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md dark:bg-gray-800">
                <div className="flex items-center">
                  <span className="text-lg font-medium mr-2">{feed.url}</span>
                  {feed.valid ? (
                    <FaCheckCircle className="text-green-500 text-xl" title="Valid Feed" />
                  ) : (
                    <FaTimesCircle className="text-red-500 text-xl" title="Invalid Feed" />
                  )}
                </div>
                <button
                  onClick={() => handleDeleteFeed(feed._id)}
                  className="text-red-600 hover:text-red-800 transition-colors dark:text-red-400 dark:hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
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
