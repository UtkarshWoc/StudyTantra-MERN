import React, { useState, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import VerifyEmailBanner from './VerifyEmailBanner';

const Layout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const isDocumentViewer = location.pathname.match(/\/documents\/[a-f0-9]{24}$/i);

  return (
    <div className="flex h-screen bg-[#0b1120] text-slate-100 overflow-hidden font-sans print:block print:h-auto print:overflow-visible print:bg-white print:text-black">
      <div className="contents print:hidden"><Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} /></div>
      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300 print:block print:overflow-visible">
        <div className="print:hidden"><Header /><VerifyEmailBanner /></div>
        <main className={`flex-1 overflow-x-hidden overflow-y-auto print:overflow-visible print:p-0 ${isDocumentViewer ? 'p-0' : 'p-6 md:p-8 lg:p-10'}`}>
          <div className={`${isDocumentViewer ? 'max-w-full h-full' : 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'}`}>
            <Suspense fallback={<div className="flex items-center justify-center py-24"><div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
