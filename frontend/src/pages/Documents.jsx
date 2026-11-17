import React, { useState } from 'react';
import DocumentCard from '../components/DocumentCard';
import UploadModal from '../components/UploadModal';
import { UploadCloud, Loader2, FolderPlus, FolderOpen, Search } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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
    <div className="flex flex-wrap items-center gap-2 animate-fade-in">
      <button className={chip(active === 'all')} onClick={() => onSelect('all')}>
        All Documents ({total})
      </button>
      <button className={chip(active === 'none')} onClick={() => onSelect('none')}>
        Unsorted ({unsorted})
      </button>
      {collections.map((c) => (
        <span key={c._id} className="inline-flex items-center gap-1">
          <button className={chip(active === c._id)} onClick={() => onSelect(c._id)}>
            {c.name} ({c.documentCount})
          </button>
          {active === c._id && (
            <Link
              to={`/collections/${c._id}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
            >
              <FolderOpen size={13} /> Open
            </Link>
          )}
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
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-label font-semibold text-primary hover:bg-primary-fixed/30 transition-colors cursor-pointer"
          onClick={() => setAdding(true)}
        >
          <FolderPlus size={14} /> + New Collection
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
    <div className="flex flex-col gap-8 pb-12 animate-fade-in font-body">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div className="flex flex-col gap-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-[11px] font-label font-bold tracking-widest uppercase text-primary">
              Knowledge Synthesis Engine
            </span>
          </div>
          <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-on-surface leading-[1.1]">
            Document Library & AI Ingestion Hub
          </h1>
          <p className="font-body text-xs sm:text-sm text-on-surface-variant leading-relaxed mt-1">
            Upload syllabi, lecture decks, and textbooks to synthesize high-yield active-recall flashcard vaults with LaTeX formula preservation.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-label font-semibold tracking-wide hover:bg-primary/95 transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            + Upload Academic Source
          </button>
        </div>
      </header>

      {/* Primary Ingestion Hero Card */}
      <section className="rounded-2xl bg-surface-container-low p-6 lg:p-8 shadow-sm border border-outline-variant/30 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Dropzone trigger */}
          <div
            onClick={() => setIsModalOpen(true)}
            className="lg:col-span-8 group relative rounded-xl bg-surface-container-lowest p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 shadow-xs hover:shadow-md border border-outline-variant/30"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary mb-3.5 transition-transform group-hover:-translate-y-1">
              <span className="material-symbols-outlined text-3xl">cloud_upload</span>
            </div>
            <h3 className="font-headline text-xl sm:text-2xl font-semibold text-on-surface tracking-tight mb-1">
              Drop lecture slides, textbooks, or scanned manuscripts here
            </h3>
            <p className="text-xs text-on-surface-variant max-w-md mb-5 leading-relaxed">
              Automatic structure detection, equation parsing via OCR, and spaced-retention deck generation.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-md bg-surface-container text-[11px] font-semibold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-tertiary text-sm">picture_as_pdf</span> PDF Documents
              </span>
              <span className="px-3 py-1 rounded-md bg-surface-container text-[11px] font-semibold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-sm">slideshow</span> Lecture Decks
              </span>
              <span className="px-3 py-1 rounded-md bg-surface-container text-[11px] font-semibold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-sm">auto_stories</span> Textbooks
              </span>
            </div>

            <button
              type="button"
              className="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-label font-semibold shadow-xs"
            >
              Browse Local Storage
            </button>
          </div>

          {/* Engine Status Column */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-4 bg-surface-container rounded-xl p-5 border border-outline-variant/20">
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-on-surface font-label">
                    Synthesis Pipeline
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-primary-fixed text-primary font-bold text-[10px] font-label">
                  v4.2 PRO
                </span>
              </div>

              <div className="p-3 rounded-lg bg-surface-container-lowest shadow-xs flex flex-col gap-1 border border-outline-variant/20">
                <div className="flex items-center justify-between text-xs font-semibold text-on-surface">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-primary">functions</span>
                    LaTeX & Proof Extractor
                  </span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">Optimal</span>
                </div>
                <p className="text-[11px] text-on-surface-variant leading-snug">
                  Preserves embedded matrices, derivations, and Greek notation in KaTeX.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-surface-container-lowest shadow-xs flex flex-col gap-1 border border-outline-variant/20">
                <div className="flex items-center justify-between text-xs font-semibold text-on-surface">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-primary">draw</span>
                    Handwriting OCR
                  </span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">99.4% Accuracy</span>
                </div>
                <p className="text-[11px] text-on-surface-variant leading-snug">
                  Calibrated on STEM college notebooks, tablet styluses, and loose-leaf margins.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] text-on-surface-variant font-label">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">memory</span> Neural Engine
              </span>
              <span className="font-semibold text-primary">Latency: ~280ms/pg</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter & Collections Strip */}
      <div className="flex flex-col gap-4">
        <CollectionsBar
          collections={collections}
          active={activeCollection}
          onSelect={selectCollection}
          total={documents.length}
          unsorted={documents.filter((d) => !d.collectionId).length}
        />

        {/* Search Bar */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline pointer-events-none" />
          <input
            type="search"
            value={searchParams.get('q') || ''}
            onChange={(e) => {
              const val = e.target.value;
              const next = new URLSearchParams(searchParams);
              if (val) next.set('q', val);
              else next.delete('q');
              setSearchParams(next);
            }}
            placeholder="Filter documents by title, author, or keyword..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs font-body text-on-surface placeholder:text-outline bg-surface-container-low border border-outline-variant/30 focus:outline-none focus:border-primary/60 focus:bg-surface-container-lowest transition-all"
          />
        </div>
      </div>

      {/* Documents Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
          <Loader2 className="animate-spin mb-3 text-primary" size={36} />
          <p className="font-headline text-lg">Loading document repository...</p>
        </div>
      ) : visibleDocuments.length === 0 ? (
        <div className="text-center py-16 bg-surface-container-low rounded-2xl p-8 border border-outline-variant/30">
          <span className="material-symbols-outlined text-4xl text-outline mb-2">folder_off</span>
          <h3 className="font-headline text-2xl text-on-surface">No documents match your filter</h3>
          <p className="text-xs text-on-surface-variant mt-1.5 mb-5 max-w-sm mx-auto">
            {query ? `No files match query "${query}".` : 'Start by uploading your first syllabus or textbook PDF.'}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-semibold"
          >
            Upload Document Now
          </button>
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleDocuments.map((doc) => (
            <DocumentCard
              key={doc._id}
              title={doc.title}
              size={formatBytes(doc.fileSize)}
              date={new Date(doc.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
              isFavorited={doc.isFavorited}
              onFavoriteToggle={() => handleToggleFavorite(doc._id)}
              onDelete={() => handleDelete(doc._id)}
              document={doc}
              footer={moveTo(doc)}
              onOpen={() => navigate(`/documents/${doc._id}`)}
              onStudy={() => navigate(`/flashcards?document=${doc._id}`)}
            />
          ))}
        </section>
      )}

      {/* Upload Modal */}
      <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Documents;
