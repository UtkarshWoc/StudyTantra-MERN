import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const isDocumentViewer = location.pathname.match(/\/documents\/[a-f0-9]{24}$/i);

  return (
    <div className="flex h-screen bg-[#0b1120] text-slate-100 overflow-hidden font-sans">
      <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300">
        <Header />
        <main className={`flex-1 overflow-x-hidden overflow-y-auto ${isDocumentViewer ? 'p-0' : 'p-6 md:p-8 lg:p-10'}`}>
          <div className={`${isDocumentViewer ? 'max-w-full h-full' : 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'}`}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
