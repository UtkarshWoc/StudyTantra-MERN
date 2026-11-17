import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocuments, useDeleteDocument, useToggleDocumentFavorite } from '../api/hooks';
import { formatBytes } from '../lib/format';
import DocumentCard from '../components/DocumentCard';

const Favorites = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { data: allDocuments = [], isLoading: loading } = useDocuments();
  const documents = allDocuments.filter((doc) => doc.isFavorited);
  const toggleFavorite = useToggleDocumentFavorite();
  const deleteDocument = useDeleteDocument();

  const handleToggleFavorite = (id) => toggleFavorite.mutate(id);
  const handleDelete = (id) => {
    if (window.confirm('Delete this document and everything generated from it?')) {
      deleteDocument.mutate(id);
    }
  };

  const filteredItems = documents.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-6 space-y-8 max-w-6xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-4 border-b border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-primary-fixed text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">star</span>
            </span>
            <span className="text-[11px] font-label font-bold uppercase tracking-widest text-primary">
              Bookmarked Materials
            </span>
          </div>
          <h1 className="font-headline text-3xl md:text-5xl font-bold text-on-surface tracking-tight">
            Curated Favorites
          </h1>
          <p className="font-body text-sm text-on-surface-variant max-w-2xl mt-1.5">
            Quick-access shelf for essential syllabus textbooks, lecture slides, and high-priority revision sets.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined text-[18px] text-outline absolute left-3.5 top-3 pointer-events-none">
            search
          </span>
          <input
            type="text"
            placeholder="Search bookmarked sources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all"
          />
        </div>
      </div>

      {/* Grid of Favorite Document Cards */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl text-primary animate-spin mb-3">progress_activity</span>
          <p className="font-label text-xs uppercase tracking-widest">Loading bookmarks...</p>
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((doc) => (
            <div
              key={doc._id}
              onClick={() => navigate(`/documents/${doc._id}`)}
              className="cursor-pointer transition-transform hover:-translate-y-1"
            >
              <DocumentCard
                title={doc.title}
                size={formatBytes(doc.sizeBytes)}
                document={doc}
                date={new Date(doc.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                isFavorited={doc.isFavorited}
                onFavoriteToggle={() => handleToggleFavorite(doc._id)}
                onDelete={() => handleDelete(doc._id)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-surface-container-lowest border border-dashed border-outline-variant/40 rounded-3xl p-8">
          <div className="w-16 h-16 rounded-2xl bg-primary-fixed text-primary mx-auto flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-3xl">star_border</span>
          </div>
          <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">No Bookmarked Sources Found</h3>
          <p className="text-sm text-on-surface-variant max-w-sm mx-auto mb-6">
            {searchQuery
              ? `No favorites matching "${searchQuery}".`
              : 'Save high-priority textbooks and lecture slides in your Document Library to surface them here for rapid review.'}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-surface-container hover:bg-surface-container-high text-xs font-label font-bold text-on-surface rounded-xl transition-colors cursor-pointer"
            >
              <span>Clear Filter</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Favorites;
