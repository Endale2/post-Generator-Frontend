import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { fetchUser } from './features/userSlice';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import RSSFeedPage from './pages/RSSFeedPage';
import SettingPage from './pages/SettingPage';
import AdminPage from './pages/AdminPage';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser()); // Fetch the user when the app loads
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Routes with Layout */}
        <Route
          path="/home"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        <Route
          path="/rss"
          element={
            <Layout>
              <RSSFeedPage />
            </Layout>
          }
        />
        <Route
          path="/settings"
          element={
            <Layout>
              <SettingPage />
            </Layout>
          }
        />
        <Route
          path="/admin"
          element={
            <Layout>
              <AdminPage />
            </Layout>
          }
        />

        {/* Redirect to landing page if no matching route */}
        <Route path="*" element={<LandingPage />} />
      </Routes>

      {/* Add ToastContainer to your component tree */}
      <ToastContainer 
        position="top-right" 
        autoClose={5000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
    </Router>
  );
};

export default App;
