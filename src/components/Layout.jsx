import React, { useState } from 'react';
import Navbar from './Navbar';
import SideBar from './SideBar';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex">
      {/* Sidebar */}
      <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarOpen && 'ml-64 lg:ml-72'} lg:ml-72`}>
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Main Content with spacing below navbar */}
        <main className="flex-1 p-4 bg-gray-100 dark:bg-gray-800 mt-16 lg:mt-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
