import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DocumentCard from '../components/DocumentCard';
import UploadModal from '../components/UploadModal';
import {
  useDocuments,
  useDeleteDocument,
  useToggleDocumentFavorite,
  useCollections,
  useSaveCollection,
  useUpdateDocument,
} from '../api/hooks';
import { getErrorMessage } from '../lib/api';
import { formatBytes } from '../lib/format';

const CollectionsBar = ({ collections, active, onSelect, total, unsorted }) => {
  const save = useSaveCollection();
  const [name, setName] = useState('');
  const [adding, setAdding] = useState(false);

  const create = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    save.mutate(
      { name: name.trim() },
      {
        onSuccess: () => {
          setName('');
          setAdding(false);
        },
      }
    );
  };

  const chip = (isActive) =>
    `inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-label font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
      isActive
        ? 'bg-primary text-on-primary shadow-xs'
        : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container border border-outline-variant/30'
    }`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button className={chip(active === 'all')} onClick={() => onSelect('all')}>
        All · {total}
      </button>
      <button className={chip(active === 'none')} onClick={() => onSelect('none')}>
        Unsorted · {unsorted}
      </button>
      {collections.map((c) => (
        <span key={c._id} className="inline-flex items-center gap-1">
          <button className={chip(active === c._id)} onClick={() => onSelect(c._id)}>
            {c.name} · {c.documentCount}
          </button>
        </span>
      ))}

      {adding ? (
        <form onSubmit={create} className="inline-flex items-center gap-1.5">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            placeholder="Collection name"
            aria-label="Collection name"
            className="px-3 py-1.5 rounded-full text-xs bg-surface-container-low border border-outline-variant text-on-surface focus:outline-none focus:border-primary transition-all"
          />
          <button type="submit" disabled={save.isPending} className="text-xs font-bold text-primary px-2 cursor-pointer">
            Add
          </button>
          <button type="button" onClick={() => setAdding(false)} className="text-xs text-outline px-1 cursor-pointer">
            Cancel
          </button>
          {save.isError && <span className="text-xs text-error">{getErrorMessage(save.error)}</span>}
        </form>
      ) : (
        <button
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-label font-semibold text-primary hover:bg-primary-fixed/30 transition-colors cursor-pointer"
          onClick={() => setAdding(true)}
        >
          <span className="material-symbols-outlined text-[16px]">create_new_folder</span>
          <span>New Collection</span>
        </button>
      )}
    </div>
  );
};

const Documents = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { data: documents = [], isLoading: loading } = useDocuments();
  const deleteDocument = useDeleteDocument();
  const toggleFavorite = useToggleDocumentFavorite();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = (searchParams.get('q') || '').trim().toLowerCase();
  const activeCollection = searchParams.get('collection') || 'all';
  const { data: collections = [] } = useCollections();
  const updateDocument = useUpdateDocument();

  const visibleDocuments = documents
    .filter((d) => !query || d.title.toLowerCase().includes(query))
    .filter(
      (d) =>
        activeCollection === 'all' ||
        (activeCollection === 'none' ? !d.collectionId : d.collectionId === activeCollection)
    );

  const selectCollection = (id) => setSearchParams(id === 'all' ? {} : { collection: id });

  const moveTo = (doc) => (
    <select
      aria-label={`Collection for ${doc.title}`}
      value={doc.collectionId || ''}
      onChange={(e) => updateDocument.mutate({ id: doc._id, collectionId: e.target.value || null })}
      className="w-full text-[11px] bg-surface-container border border-outline-variant/30 text-on-surface rounded-md px-2 py-1 cursor-pointer focus:outline-none focus:border-primary"
    >
      <option value="">No collection</option>
      {collections.map((c) => (
        <option key={c._id} value={c._id}>
          {c.name}
        </option>
      ))}
    </select>
  );

  const handleDelete = (id) => {
    if (window.confirm('Delete this document and all synthesized flashcards & quizzes?')) {
      deleteDocument.mutate(id);
    }
  };

  const handleToggleFavorite = (id) => toggleFavorite.mutate(id);

  return (
    <div className="py-6 space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 md:p-8 shadow-[0_2px_16px_rgba(58,48,42,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
            Document Library
          </h1>
          <p className="font-body text-xs md:text-sm text-on-surface-variant mt-1">
            Upload course texts, lecture slides, and notes to generate flashcards and quizzes.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label text-xs font-bold shadow-md hover:shadow-lg transition-all duration-150 transform active:scale-95 cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">upload_file</span>
          <span>Upload Document</span>
        </button>
      </div>

      {/* Collection Filter Chips */}
      {!loading && documents.length > 0 && (
        <CollectionsBar
          collections={collections}
          active={activeCollection}
          onSelect={selectCollection}
          total={documents.length}
          unsorted={documents.filter((d) => !d.collectionId).length}
        />
      )}

      {/* Documents Grid or Loading */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl text-primary animate-spin mb-3">progress_activity</span>
          <p className="font-label text-xs uppercase tracking-widest">Loading Library...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {visibleDocuments.map((doc) => (
            <div
              key={doc._id}
              onClick={() => navigate(`/documents/${doc._id}`)}
              className="cursor-pointer transition-transform hover:-translate-y-1"
            >
              <DocumentCard
                title={doc.title}
                size={formatBytes(doc.sizeBytes)}
                document={doc}
                date={new Date(doc.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
                isFavorited={doc.isFavorited}
                onFavoriteToggle={() => handleToggleFavorite(doc._id)}
                onDelete={() => handleDelete(doc._id)}
                footer={moveTo(doc)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Search results notice */}
      {!loading && query && (
        <div className="flex items-center justify-between text-xs text-on-surface-variant p-3 rounded-xl bg-surface-container-low border border-outline-variant/30">
          <span>
            {visibleDocuments.length} {visibleDocuments.length === 1 ? 'document' : 'documents'} matching "{query}"
          </span>
          <button
            onClick={() => setSearchParams({})}
            className="text-primary font-bold hover:underline cursor-pointer"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && documents.length === 0 && (
        <div className="text-center py-20 bg-surface-container-lowest border border-dashed border-outline-variant/40 rounded-3xl p-8">
          <div className="w-16 h-16 rounded-2xl bg-primary-fixed text-primary mx-auto flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-3xl">cloud_upload</span>
          </div>
          <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">No Documents Yet</h3>
          <p className="text-xs text-on-surface-variant max-w-sm mx-auto mb-6">
            Upload your first syllabus, textbook chapter, or lecture PDF to synthesize spaced recall decks.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label text-xs font-bold cursor-pointer"
          >
            <span>Upload Document</span>
          </button>
        </div>
      )}

      <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Documents;
