import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  
  // If we are on the exact document viewing page, expand the layout completely
  const isDocumentViewer = location.pathname.match(/\/documents\/[a-f0-9]{24}$/i);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden font-sans text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300">
        <Header />
        <main className={`flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-200 ${isDocumentViewer ? 'p-0' : 'p-6 md:p-8'}`}>
          <div className={`${isDocumentViewer ? 'max-w-full h-full' : 'max-w-7xl mx-auto'}`}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
