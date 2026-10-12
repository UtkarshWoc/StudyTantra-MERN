import React, { useState } from 'react';
import DocumentCard from '../components/DocumentCard';
import UploadModal from '../components/UploadModal';
import { UploadCloud, Loader2, FolderPlus, FolderOpen } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDocuments, useDeleteDocument, useToggleDocumentFavorite, useCollections, useSaveCollection, useUpdateDocument } from '../api/hooks';
import { getErrorMessage } from '../lib/api';
import { formatBytes } from '../lib/format';

const chip = (active) => `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${active ? 'bg-amber-500/15 border-amber-500/50 text-amber-300' : 'border-[#334155]/60 text-slate-400 hover:text-slate-200'}`;

// Filter chips for collections, plus inline creation
const CollectionsBar = ({ collections, active, onSelect, total, unsorted }) => {
  const save = useSaveCollection();
  const [name, setName] = useState('');
  const [adding, setAdding] = useState(false);

  const create = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    save.mutate({ name: name.trim() }, { onSuccess: () => { setName(''); setAdding(false); } });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button className={chip(active === 'all')} onClick={() => onSelect('all')}>All · {total}</button>
      <button className={chip(active === 'none')} onClick={() => onSelect('none')}>Unsorted · {unsorted}</button>
      {collections.map((c) => (
        <span key={c._id} className="inline-flex items-center">
          <button className={chip(active === c._id)} onClick={() => onSelect(c._id)}>{c.name} · {c.documentCount}</button>
          {active === c._id && (
            <Link to={`/collections/${c._id}`} className="ml-1 inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300"><FolderOpen size={13} /> Open</Link>
          )}
        </span>
      ))}
      {adding ? (
        <form onSubmit={create} className="inline-flex items-center gap-1">
          <input autoFocus value={name} onChange={(e) => setName(e.target.value)} maxLength={80} placeholder="Collection name" aria-label="Collection name"
            className="px-3 py-1.5 rounded-full text-xs bg-[#0b1120] border border-[#334155]/60 text-slate-200 focus:outline-none focus:border-amber-500/60" />
          <button type="submit" disabled={save.isPending} className="text-xs font-bold text-amber-400 px-2 cursor-pointer">Add</button>
          <button type="button" onClick={() => setAdding(false)} className="text-xs text-slate-500 px-1 cursor-pointer">Cancel</button>
          {save.isError && <span className="text-xs text-red-400">{getErrorMessage(save.error)}</span>}
        </form>
      ) : (
        <button className={chip(false)} onClick={() => setAdding(true)}><FolderPlus size={13} /> New collection</button>
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
    .filter(d => !query || d.title.toLowerCase().includes(query))
    .filter(d => activeCollection === 'all' || (activeCollection === 'none' ? !d.collectionId : d.collectionId === activeCollection));
  const selectCollection = (id) => setSearchParams(id === 'all' ? {} : { collection: id });

  const moveTo = (doc) => (
    <select
      aria-label={`Collection for ${doc.title}`}
      value={doc.collectionId || ''}
      onChange={(e) => updateDocument.mutate({ id: doc._id, collectionId: e.target.value || null })}
      className="max-w-full text-xs bg-[#0b1120] border border-[#334155]/60 text-slate-400 rounded-md px-1.5 py-1 cursor-pointer"
    >
      <option value="">No collection</option>
      {collections.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
    </select>
  );

  const handleDelete = (id) => { if (window.confirm("Delete this document and everything generated from it?")) deleteDocument.mutate(id); };
  const handleToggleFavorite = (id) => toggleFavorite.mutate(id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111827] border border-[#334155]/50 rounded-3xl p-6 shadow-xl shadow-black/20">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Your Library</h1>
          <p className="text-sm text-slate-400 font-medium mt-1">Manage documents and generate study materials.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-[#0b1120] font-extrabold px-5 py-2.5 rounded-xl shadow-lg shadow-amber-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"><UploadCloud size={18} /> Upload Document</button>
      </div>

      {!loading && documents.length > 0 && (
        <CollectionsBar
          collections={collections}
          active={activeCollection}
          onSelect={selectCollection}
          total={documents.length}
          unsorted={documents.filter((d) => !d.collectionId).length}
        />
      )}

      {loading ? (<div className="flex flex-col items-center py-20 text-slate-500"><Loader2 className="animate-spin mb-4 text-amber-500" size={36} /><p className="font-medium">Loading library...</p></div>) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {visibleDocuments.map(doc => (<div key={doc._id} onClick={() => navigate(`/documents/${doc._id}`)} className="cursor-pointer transition-transform hover:-translate-y-1"><DocumentCard title={doc.title} size={formatBytes(doc.sizeBytes)} document={doc} date={new Date(doc.createdAt).toLocaleDateString()} isFavorited={doc.isFavorited} onFavoriteToggle={() => handleToggleFavorite(doc._id)} onDelete={() => handleDelete(doc._id)} footer={moveTo(doc)} /></div>))}
        </div>
      )}

      {!loading && query && (
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>{visibleDocuments.length} result{visibleDocuments.length === 1 ? '' : 's'} for "{searchParams.get('q')}"</span>
          <button onClick={() => setSearchParams({})} className="text-amber-400 font-semibold hover:text-amber-300 cursor-pointer">Clear search</button>
        </div>
      )}

      {!loading && documents.length === 0 && (
        <div className="text-center py-20 bg-[#111827] rounded-3xl border border-dashed border-[#334155]/60">
          <UploadCloud size={48} className="mx-auto text-slate-600 mb-4" />
          <h3 className="text-lg font-bold text-slate-200 mb-1">No documents yet</h3>
          <p className="text-sm text-slate-500 mb-6">Upload your first PDF to begin.</p>
          <button onClick={() => setIsModalOpen(true)} className="text-amber-400 font-bold hover:text-amber-300 cursor-pointer">Upload Now</button>
        </div>
      )}

      <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Documents;
