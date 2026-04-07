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
    try {
      setLoading(true);
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/documents`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [user, isModalOpen]); // refetch when modal closes (new upload)

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/documents/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setDocuments(documents.filter(doc => doc._id !== id));
    } catch (error) {
      console.error('Failed to delete document', error);
    }
  };

  const handleToggleFavorite = async (id, currentStatus) => {
    try {
      // Optimistic update
      setDocuments(documents.map(doc => doc._id === id ? { ...doc, isFavorited: !currentStatus } : doc));
      
      await axios.put(`${process.env.REACT_APP_API_URL}/api/documents/${id}/favorite`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
    } catch (error) {
      console.error('Failed to toggle favorite', error);
      // Revert optimistic update on error
      setDocuments(documents.map(doc => doc._id === id ? { ...doc, isFavorited: currentStatus } : doc));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Library</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Manage and chat with your uploaded documents.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center shadow-md transition-all hover:shadow-lg cursor-pointer"
        >
          <UploadCloud size={20} className="mr-2" />
          Upload Document
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
           <Loader2 className="animate-spin mb-4" size={48} />
           <p className="font-medium">Loading your library...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {documents.map((doc) => (
            <div key={doc._id} onClick={() => navigate(`/documents/${doc._id}`)} className="cursor-pointer transition-transform hover:-translate-y-1">
               <DocumentCard 
                 title={doc.title} 
                 size="PDF" 
                 date={new Date(doc.createdAt).toLocaleDateString()} 
                 isFavorited={doc.isFavorited}
                 onFavoriteToggle={() => handleToggleFavorite(doc._id, doc.isFavorited)}
                 onDelete={() => handleDelete(doc._id)} 
               />
            </div>
          ))}
        </div>
      )}

      {!loading && documents.length === 0 && (
        <div className="text-center py-20 bg-white dark:bg-gray-800 transition-colors rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
          <UploadCloud size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">No documents yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">Upload your first PDF or lecture notes to generate study materials.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-800 dark:hover:text-indigo-300 cursor-pointer"
          >
            Upload Now
          </button>
        </div>
      )}

      <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Documents;
