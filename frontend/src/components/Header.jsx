import React from 'react';
import { Search, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user } = useAuth();
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-6 sticky top-0 z-10 transition-colors duration-200">
      <div className="flex-1 flex items-center">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white mr-8">Dashboard Overview</h1>
        <div className="max-w-md w-full relative hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-100 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Search your library..."
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          <Bell size={20} />
        </button>
        <div className="border-l border-gray-200 dark:border-gray-700 h-8 mx-2"></div>
        <div className="flex items-center space-x-3 cursor-pointer">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-gray-900 dark:text-white leading-none">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Free Plan</p>
          </div>
          <div className="h-8 w-8 rounded-full bg-orange-200 flex items-center justify-center text-orange-600 font-bold text-sm">
            {user?.name?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
