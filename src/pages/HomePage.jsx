import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NewsCard from '../components/NewsCard';
import axios from '../axiosConfig';
import { FaSpinner, FaRedo } from 'react-icons/fa';
import { toast } from 'react-toastify';

const HomePage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndFetchNews = async () => {
      try {
        const userResponse = await axios.get('/auth/user', { withCredentials: true });
        if (!userResponse.data || !userResponse.data.role) {
          navigate('/login');
          return;
        }

        const role = userResponse.data.role;
        setIsAdmin(role === 'admin');

        const newsResponse = await axios.get('/posts', { withCredentials: true });
        if (newsResponse.data.length > 0) {
          setNews(newsResponse.data[0].posts.slice(0, 3));
        } else {
          setNews([]);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          navigate('/login');
        } else {
          toast.error(`Error: ${error.response?.data?.message || error.message}`);
        }
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
    <div className="flex flex-col items-center justify-center flex-1 min-h-screen  bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-5xl">
        <h2 className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Today's Top 3 Posts
        </h2>

        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <FaSpinner className="animate-spin text-4xl text-gray-600 dark:text-gray-400" />
          </div>
        ) : news.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
              No posts for today.
            </p>
            {isAdmin && (
              <>
                <p className="text-gray-700 dark:text-gray-300 mt-4">
                  Please reload posts in the admin section.
                </p>
                <button
                  onClick={handleReloadNews}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center justify-center mx-auto"
                >
                  <FaRedo className="mr-2" />
                  Go to Admin
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
