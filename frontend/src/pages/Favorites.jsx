import React, { useState } from 'react';
import { 
  Heart, 
  Search, 
  FileText, 
  Layers, 
  BrainCircuit,
  MoreVertical,
  Star
} from 'lucide-react';

const Favorites = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const favoriteItems = [];

  const filteredItems = favoriteItems.filter(item => {
    const matchesTab = activeTab === 'all' || item.type === activeTab;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const tabs = [
    { id: 'all', label: 'All Items' },
    { id: 'document', label: 'Documents' },
    { id: 'flashcard', label: 'Flashcards' },
    { id: 'quiz', label: 'Quizzes' }
  ];

  return (
    <div className="flex-1 bg-gray-50/50 dark:bg-gray-900 min-h-screen p-8 w-full block transition-colors">
      <div className="max-w-6xl mx-auto flex flex-col items-start w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              <Heart className="text-rose-500 fill-rose-500" size={28} />
              Favorites
            </h1>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">Your saved study materials for quick access.</p>
          </div>
          
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search favorites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm outline-none text-sm"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 w-full mb-2" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-pointer whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid of Items */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full animate-in fade-in duration-500">
            {filteredItems.map(item => (
              <div 
                key={item.id} 
                className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all p-5 flex flex-col h-full cursor-pointer hover:border-indigo-100 dark:hover:border-indigo-500"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-inner ${item.color}`}>
                    {item.icon}
                  </div>
                  <div className="flex gap-1 border border-gray-100 dark:border-gray-700 rounded-lg p-1">
                    <button className="cursor-pointer p-1.5 text-rose-500 hover:text-gray-400 dark:hover:text-gray-500 transition-colors rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                      <Heart className="fill-rose-500" size={18} />
                    </button>
                    <button className="cursor-pointer p-1.5 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>
                
                <div className="mt-auto flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/40 px-2.5 py-0.5 rounded-full">
                      {item.type}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                      {item.dateAdded}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full flex flex-col items-center justify-center py-24 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 border-dashed transition-colors">
            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900/50 rounded-full flex items-center justify-center mb-4">
              <Star className="text-gray-300 dark:text-gray-600" size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">No favorites found</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm">
              {searchQuery 
                ? `We couldn't find any favorites matching "${searchQuery}".` 
                : "You haven't saved any items to your favorites yet. Start exploring and hit the heart icon to save items here!"}
            </p>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="cursor-pointer mt-6 px-5 py-2 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-lg font-medium hover:bg-indigo-100 dark:hover:bg-indigo-800/50 transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
