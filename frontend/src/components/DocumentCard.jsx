import React from 'react';
import { FileText, Trash2 } from 'lucide-react';
import DocumentStatus from './DocumentStatus';

const DocumentCard = ({ title, size, date, onDelete, isFavorited, onFavoriteToggle, document, footer }) => {
  return (
    <div className="glass-card glass-card-hover rounded-2xl p-5 group flex items-start justify-between cursor-pointer">
      <div className="flex items-start space-x-4 flex-1 overflow-hidden pr-2">
        <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 flex-shrink-0 group-hover:bg-amber-500/15 group-hover:shadow-lg group-hover:shadow-amber-500/10 transition-all duration-300">
          <FileText size={22} />
        </div>
        <div className="min-w-0">
          <h4 className="text-slate-100 font-semibold text-sm mb-1 truncate group-hover:text-white transition-colors">{title}</h4>
          <div className="flex items-center text-xs text-slate-500 space-x-2">
            <span>{size}</span>
            <span>&bull;</span>
            <span>{date}</span>
          </div>
          {document && <div className="mt-1.5"><DocumentStatus document={document} compact /></div>}
          {footer && <div className="mt-2" onClick={(e) => e.stopPropagation()}>{footer}</div>}
        </div>
      </div>
      <div className="flex flex-col space-y-1 items-end sm:flex-row sm:space-y-0 sm:space-x-1 sm:items-center">
        <button
          onClick={(e) => { e.stopPropagation(); onFavoriteToggle(); }}
          className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${isFavorited ? 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/10' : 'text-slate-600 hover:text-amber-400 hover:bg-amber-500/10 opacity-0 group-hover:opacity-100'}`}
          aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={isFavorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="text-slate-600 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"
          aria-label="Delete document"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default DocumentCard;
