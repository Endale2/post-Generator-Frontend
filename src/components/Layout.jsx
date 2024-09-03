// src/components/Layout.jsx
import React from 'react';
import Navbar from './Navbar';
import SideBar from './SideBar';

const Layout = ({ children, darkMode, toggleDarkMode }) => {
  return (
    <div className={`flex ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <SideBar />

      <div className="flex-1 flex flex-col min-h-screen ml-64 lg:ml-72">
        {/* Navbar */}
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

        {/* Main Content */}
        <main className="flex-1 p-4 bg-gray-100 dark:bg-gray-800 mt-16">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
