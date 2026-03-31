import React from 'react';
import { FileText, Trash2 } from 'lucide-react';

const DocumentCard = ({ title, size, date, onDelete }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:border-indigo-200 dark:hover:border-indigo-500 hover:shadow-md transition-all group flex items-start justify-between cursor-pointer">
      <div className="flex items-start space-x-4">
        <div className="bg-indigo-50 dark:bg-indigo-900/40 p-3 rounded-lg text-indigo-600 dark:text-indigo-400">
          <FileText size={24} />
        </div>
        <div>
          <h4 className="text-gray-900 dark:text-gray-100 font-semibold text-sm mb-1">{title}</h4>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-2">
            <span>{size}</span>
            <span>&bull;</span>
            <span>{date}</span>
          </div>
        </div>
      </div>
      <button 
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
        aria-label="Delete document"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default DocumentCard;
