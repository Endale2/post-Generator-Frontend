import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NewsCard from '../components/NewsCard';
import axios from '../axiosConfig'; // Import the Axios instance
import { FaSpinner, FaRedo } from 'react-icons/fa';
import { toast } from 'react-toastify'; // Import toast for notifications
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

const HomePage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndFetchNews = async () => {
      try {
        // Fetch user data to check role
        const userResponse = await axios.get('/auth/user', {
          withCredentials: true // Ensure cookies are sent with the request
        });

        const role = userResponse.data.role;
        setIsAdmin(role === 'admin');

        // Fetch news data
        const newsResponse = await axios.get('/posts', {
          withCredentials: true // Ensure cookies are sent with the request
        });

        if (newsResponse.data.length > 0) {
          setNews(newsResponse.data[0].posts.slice(0, 3)); // Get the top 3 news
        } else {
          setNews([]);
        }
      } catch (error) {
        toast.error('Error verifying token or fetching news: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchNews();
  }, [navigate]);

  const handleReloadNews = () => {
    navigate('/admin');
  };

  return (
    <main className="flex-1 p-6 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Today's Top 3 News
        </h2>

        {loading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <FaSpinner className="animate-spin text-4xl text-gray-600 dark:text-gray-400" />
          </div>
        ) : news.length > 0 ? (
          <div className="space-y-6">
            {news.map((item) => (
              <NewsCard
                key={item._id}
                title={item.title}
                description={item.content}
                link={item.link}
              />
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              No news for today.
              {isAdmin && (
                <>
                  <span className="block mt-4 text-gray-700 dark:text-gray-300">
                    Please reload news in the admin section.
                  </span>
                  <button
                    onClick={handleReloadNews}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center justify-center mx-auto"
                  >
                    <FaRedo className="mr-2" />
                    Go to Admin
                  </button>
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default HomePage;
