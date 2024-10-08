import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpinner, FaRedo } from 'react-icons/fa';
import axios from '../axiosConfig';
import { toast } from 'react-toastify';
import NewsCard from '../components/NewsCard';
import Layout from '../components/Layout'; // Import the Layout component

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
        setNews(newsResponse.data.length > 0 ? newsResponse.data[0].posts.slice(0, 3) : []);
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
    <Layout> {/* Wrap the content in Layout */}
      <div className="w-full max-w-6xl mx-auto">
        <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Today's Top 3 Posts
        </h2>

        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <FaSpinner className="animate-spin text-4xl text-gray-600 dark:text-gray-400" />
          </div>
        ) : news.length > 0 ? (
          <div className="flex flex-col space-y-4">
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
    </Layout>
  );
};

export default HomePage;
