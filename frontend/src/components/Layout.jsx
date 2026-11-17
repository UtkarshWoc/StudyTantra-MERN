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
    <div className="flex h-screen bg-background text-on-surface overflow-hidden font-body antialiased print:block print:h-auto print:overflow-visible print:bg-white print:text-black">
      {/* Sidebar navigation */}
      <div className="contents print:hidden">
        <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
      </div>

      {/* Main content pane */}
      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300 print:block print:overflow-visible">
        <div className="print:hidden">
          <Header onToggleMobileSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
          <VerifyEmailBanner />
        </div>

        <main
          className={`flex-1 overflow-x-hidden overflow-y-auto bg-background print:overflow-visible print:p-0 ${
            isDocumentViewer ? 'p-0' : 'p-4 sm:p-6 md:p-8 lg:p-10'
          }`}
        >
          <div
            className={`w-full ${
              isDocumentViewer ? 'max-w-full h-full' : 'max-w-[1400px] mx-auto'
            }`}
          >
            <Suspense
              fallback={
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                  <div className="w-9 h-9 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-label text-on-surface-variant animate-pulse">
                    Loading learning space...
                  </span>
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
