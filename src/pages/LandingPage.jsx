import React from 'react';
import { Link} from 'react-router-dom';

const LandingPage = () => {
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-800 via-gray-700 to-gray-600 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-6">
      <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 text-white text-center drop-shadow-lg animate-fadeIn">
        Welcome to Posts Portal
      </h1>
      <p className="text-lg sm:text-xl mb-10 text-gray-300 text-center max-w-3xl animate-fadeIn delay-100">
        Get quick, ready-to-use posts in the LinkedIn format.
      </p>
      <div className="flex space-x-4 animate-fadeIn delay-200">
        <Link to="/login">
          <button className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg transform hover:scale-105 hover:bg-blue-600 transition-all duration-300">
            Login
          </button>
        </Link>
        <Link to="/register">
          <button className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg transform hover:scale-105 hover:bg-green-600 transition-all duration-300">
            Register
          </button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
