import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Layers, Target, Star, User, Settings, LogOut, Hexagon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const mainNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Documents', path: '/documents', icon: <FileText size={20} /> },
    { name: 'Flashcards', path: '/flashcards', icon: <Layers size={20} /> },
    { name: 'Quizzes', path: '/quizzes', icon: <Target size={20} /> },
    { name: 'Favorites', path: '/favorites', icon: <Star size={20} /> },
  ];

  const accountNavItems = [
    { name: 'Profile', path: '/profile', icon: <User size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 h-screen flex flex-col pt-5 pb-4 sticky top-0 z-20 transition-all duration-300 ease-in-out`}>
      {/* Logo & Toggle */}
      <div className={`flex items-center mb-8 px-4 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <div className={`flex items-center ${isCollapsed ? 'hidden' : 'flex'}`}>
          <div className="bg-indigo-600 text-white p-1.5 rounded-lg mr-3 shadow-sm">
            <Hexagon size={24} className="fill-current" />
          </div>
          <div className="text-gray-900 dark:text-white font-bold text-xl tracking-tight leading-none whitespace-nowrap overflow-hidden">Study Tantra</div>
        </div>
        
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer flex-shrink-0 bg-white dark:bg-gray-800"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      
      <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
        <nav className="flex-1 px-3 space-y-1.5">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              title={isCollapsed ? item.name : ""}
              className={({ isActive }) =>
                `group flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-3'} py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <div className={isCollapsed ? '' : 'mr-3'}>{item.icon}</div>
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </NavLink>
          ))}

          <div className={`pt-6 pb-2 ${isCollapsed ? 'text-center px-0' : 'px-3'}`}>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
               {isCollapsed ? '•••' : 'Account'}
            </p>
          </div>

          {accountNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              title={isCollapsed ? item.name : ""}
              className={({ isActive }) =>
                `group flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-3'} py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <div className={isCollapsed ? '' : 'mr-3'}>{item.icon}</div>
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className={`flex-shrink-0 flex flex-col px-3 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700`}>
        <button 
          onClick={handleLogout} 
          title={isCollapsed ? "Logout" : ""}
          className={`group flex ${isCollapsed ? 'justify-center px-0' : 'px-3'} items-center py-2.5 text-sm font-medium rounded-xl text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors duration-200 cursor-pointer w-full`}
        >
          <LogOut size={20} className={isCollapsed ? '' : 'mr-3'} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
