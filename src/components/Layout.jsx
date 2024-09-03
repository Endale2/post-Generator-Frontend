import React, { useState } from 'react';
import Navbar from './Navbar';
import SideBar from './SideBar';

const Layout = ({ children, darkMode, toggleDarkMode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`flex ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        className={`flex-1 flex flex-col min-h-screen ${
          isSidebarOpen ? 'ml-64 lg:ml-72' : 'lg:ml-0'
        } transition-all duration-300`}
      >
        {/* Navbar */}
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <main className="flex-1 p-4 bg-gray-100 dark:bg-gray-800 mt-16">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
