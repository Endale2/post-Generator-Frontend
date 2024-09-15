import Navbar from './Navbar';
import SideBar from './SideBar';
import Footer from './Footer';
import { useState } from 'react';

function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content area */}
      <div className="flex flex-col flex-grow lg:ml-64"> {/* Add left margin on large screens to account for the sidebar */}
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Main content */}
        <main className="flex-grow p-4 overflow-auto">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default Layout;
