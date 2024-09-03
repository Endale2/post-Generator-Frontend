import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../axiosConfig';
import { FaSpinner } from 'react-icons/fa';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post('/auth/register', { name, email, password });
      navigate('/login');
    } catch (error) {
      console.error('Error registering:', error);
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-96 transform transition-all duration-500 hover:scale-105"
      >
        <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-900 dark:text-white">Sign Up</h1>
        
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        
        <div className="mb-6">
          <label htmlFor="name" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter your name"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="email" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter your password"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center justify-center"
          disabled={loading}
        >
          {loading ? <FaSpinner className="animate-spin mr-2" /> : 'Register'}
        </button>
        
        <p className="mt-6 text-center text-gray-700 dark:text-gray-300 text-sm">
          Already have an account? <Link to="/login" className="text-purple-600 hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
