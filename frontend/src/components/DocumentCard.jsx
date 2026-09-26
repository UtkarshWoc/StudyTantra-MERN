import React from 'react';
import { FileText, Trash2 } from 'lucide-react';

const DocumentCard = ({ title, size, date, onDelete, isFavorited, onFavoriteToggle }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl bg-[#111827] border border-[#334155]/50 shadow-xl shadow-black/10 p-5 hover:border-amber-500/40 hover:shadow-amber-900/10 transition-all group flex items-start justify-between cursor-pointer">
      <div className="flex items-start space-x-4 flex-1 overflow-hidden pr-2">
        <div className="bg-indigo-50 dark:bg-indigo-900/40 p-3 rounded-lg text-indigo-600 dark:text-indigo-400 flex-shrink-0">
          <FileText size={24} />
        </div>
        <div className="min-w-0">
          <h4 className="text-gray-900 dark:text-gray-100 font-semibold text-sm mb-1 truncate">{title}</h4>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-2">
            <span>{size}</span>
            <span>&bull;</span>
            <span>{date}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-1 items-end sm:flex-row sm:space-y-0 sm:space-x-1 sm:items-center">
        <button 
          onClick={(e) => { e.stopPropagation(); onFavoriteToggle(); }}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${isFavorited ? 'text-amber-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/30' : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-gray-700/50 opacity-0 group-hover:opacity-100'}`}
          aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={isFavorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
          aria-label="Delete document"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default DocumentCard;
