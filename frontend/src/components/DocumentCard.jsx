import React from 'react';
import { Trash2 } from 'lucide-react';
import DocumentStatus from './DocumentStatus';

const DocumentCard = ({
  title,
  size,
  date,
  onDelete,
  isFavorited,
  onFavoriteToggle,
  document,
  footer,
  onOpen,
  onStudy,
}) => {
  return (
    <article
      onClick={onOpen}
      className="group rounded-2xl bg-surface-container-lowest p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 border border-outline-variant/30 cursor-pointer"
    >
      <div className="flex flex-col gap-3.5">
        {/* Top Header: Tag and Favorite Button */}
        <div className="flex items-start justify-between gap-2">
          <span className="px-2.5 py-1 rounded-md bg-primary-fixed text-primary text-[10px] font-label font-bold tracking-wider uppercase">
            {document?.collectionName || 'Document Source'}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFavoriteToggle();
              }}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isFavorited
                  ? 'text-primary'
                  : 'text-outline hover:text-primary hover:bg-surface-container'
              }`}
              aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: isFavorited ? "'FILL' 1" : "'FILL' 0" }}
              >
                star
              </span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-error-container/20 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
              aria-label="Delete document"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Thumbnail and Title */}
        <div className="flex gap-3.5 items-start">
          <div className="w-12 h-14 rounded-lg bg-surface-container flex-shrink-0 flex items-center justify-center text-primary shadow-xs">
            <span className="material-symbols-outlined text-2xl">menu_book</span>
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <h3 className="font-headline text-base font-bold text-on-surface leading-snug line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <div className="flex items-center gap-2 text-[11px] text-on-surface-variant font-label mt-1">
              <span>{size}</span>
              <span>•</span>
              <span>{date}</span>
            </div>
            {document && (
              <div className="mt-1.5">
                <DocumentStatus document={document} compact />
              </div>
            )}
          </div>
        </div>

        {/* Retention Mini Bar */}
        <div className="p-2.5 rounded-xl bg-surface-container-low flex items-center justify-between text-xs font-label mt-1">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase font-bold text-on-surface-variant">Retention</span>
            <span className="font-bold text-on-surface text-xs">89%</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            Active Recall
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[9px] uppercase font-bold text-on-surface-variant">Status</span>
            <span className="text-on-surface font-medium text-[11px]">Ready</span>
          </div>
        </div>

        {footer && (
          <div className="pt-1" onClick={(e) => e.stopPropagation()}>
            {footer}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 mt-3 border-t border-outline-variant/30 gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onOpen) onOpen();
          }}
          className="flex-1 py-1.5 px-3 rounded-lg bg-surface-container text-on-surface text-xs font-label font-semibold hover:bg-surface-container-high transition-colors text-center cursor-pointer"
        >
          Open Reader
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onStudy) onStudy();
            else if (onOpen) onOpen();
          }}
          className="flex-1 py-1.5 px-3 rounded-lg bg-primary text-on-primary text-xs font-label font-semibold hover:bg-primary/90 transition-colors text-center shadow-xs cursor-pointer"
        >
          Study Deck
        </button>
      </div>
    </article>
  );
};

export default DocumentCard;
