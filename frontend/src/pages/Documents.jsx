import React, { useState, useEffect } from 'react';
import DocumentCard from '../components/DocumentCard';
import UploadModal from '../components/UploadModal';
import { UploadCloud, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Documents = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchDocuments = async () => {
    if (!user) return;
    try { setLoading(true); const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/documents`, { headers: { Authorization: `Bearer ${user.token}` } }); setDocuments(data); } catch (e) { console.error('Error', e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchDocuments(); }, [user, isModalOpen]);

  const handleDelete = async (id) => { if (!window.confirm("Delete this document?")) return; try { await axios.delete(`${import.meta.env.VITE_API_URL}/api/documents/${id}`, { headers: { Authorization: `Bearer ${user.token}` } }); setDocuments(documents.filter(d => d._id !== id)); } catch (e) { console.error(e); } };
  const handleToggleFavorite = async (id, current) => { try { setDocuments(documents.map(d => d._id === id ? { ...d, isFavorited: !current } : d)); await axios.put(`${import.meta.env.VITE_API_URL}/api/documents/${id}/favorite`, {}, { headers: { Authorization: `Bearer ${user.token}` } }); } catch (e) { setDocuments(documents.map(d => d._id === id ? { ...d, isFavorited: current } : d)); } };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111827] border border-[#334155]/50 rounded-3xl p-6 shadow-xl shadow-black/20">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Your Library</h1>
          <p className="text-sm text-slate-400 font-medium mt-1">Manage documents and generate study materials.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-[#0b1120] font-extrabold px-5 py-2.5 rounded-xl shadow-lg shadow-amber-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"><UploadCloud size={18} /> Upload Document</button>
      </div>

      {loading ? (<div className="flex flex-col items-center py-20 text-slate-500"><Loader2 className="animate-spin mb-4 text-amber-500" size={36} /><p className="font-medium">Loading library...</p></div>) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {documents.map(doc => (<div key={doc._id} onClick={() => navigate(`/documents/${doc._id}`)} className="cursor-pointer transition-transform hover:-translate-y-1"><DocumentCard title={doc.title} size="PDF" date={new Date(doc.createdAt).toLocaleDateString()} isFavorited={doc.isFavorited} onFavoriteToggle={() => handleToggleFavorite(doc._id, doc.isFavorited)} onDelete={() => handleDelete(doc._id)} /></div>))}
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
