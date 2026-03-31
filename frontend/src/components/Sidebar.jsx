import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Layers, Target, Star, User, Settings, LogOut, Hexagon } from 'lucide-react';

const Sidebar = () => {
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
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 h-screen flex flex-col pt-5 pb-4 sticky top-0 z-20 transition-colors duration-200">
      {/* Logo */}
      <div className="flex items-center px-6 mb-8">
        <div className="bg-indigo-600 text-white p-1.5 rounded-lg mr-3">
          <Hexagon size={24} className="fill-current" />
        </div>
        <div className="text-gray-900 dark:text-white font-bold text-xl tracking-tight">Study Tantra</div>
      </div>
      
      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 px-4 space-y-1.5">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <div className="mr-3">{item.icon}</div>
              {item.name}
            </NavLink>
          ))}

          <div className="pt-6 pb-2">
            <p className="px-3 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Account
            </p>
          </div>

          {accountNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <div className="mr-3">{item.icon}</div>
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="flex-shrink-0 flex flex-col px-4 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
        <button className="group flex w-full items-center px-3 py-2.5 text-sm font-medium rounded-xl text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors duration-200 cursor-pointer">
          <LogOut size={20} className="mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
