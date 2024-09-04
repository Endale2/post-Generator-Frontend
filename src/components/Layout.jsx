import React from 'react';
import Navbar from './Navbar';
import SideBar from './SideBar';
import Footer from './Footer';

const Layout = ({ children, darkMode, toggleDarkMode }) => {
  return (
    <div className={`flex flex-col ${darkMode ? 'dark' : ''}`}>
      {/* Navbar */}
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <div className="flex">
        {/* Sidebar for large screens */}
        <div className="hidden lg:block">
          <SideBar />
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
          <main className="flex-1 p-4 bg-gray-100 dark:bg-gray-800 mt-16">
            {children}
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Layout;
