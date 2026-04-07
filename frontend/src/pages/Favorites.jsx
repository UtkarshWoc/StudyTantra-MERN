import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Search, 
  FileText,
  Star,
  Loader2
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import DocumentCard from '../components/DocumentCard';

const Favorites = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchDocuments = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/documents`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setDocuments(data.filter(doc => doc.isFavorited));
    } catch (error) {
      console.error('Error fetching documents', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [user]);

  const handleToggleFavorite = async (id, currentStatus) => {
    try {
      // Optimistic update - just remove it from the favorites list since we are on the Favorites page
      setDocuments(documents.filter(doc => doc._id !== id));
      
      await axios.put(`${process.env.REACT_APP_API_URL}/api/documents/${id}/favorite`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
    } catch (error) {
      console.error('Failed to toggle favorite', error);
      // On error, let's just refetch
      fetchDocuments();
    }
  };

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

  const filteredItems = documents.filter(item => {
    return item.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex-1 bg-gray-50/50 dark:bg-gray-900 min-h-screen pb-8 w-full block transition-colors">
      <div className="max-w-6xl mx-auto flex flex-col items-start w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full mb-8 gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              <Star className="text-amber-400 fill-amber-400" size={28} />
              Favorites
            </h1>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">Your saved study materials for quick access.</p>
          </div>
          
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search favorites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors shadow-sm outline-none text-sm"
            />
          </div>
        </div>

        {/* Grid of Items */}
        {loading ? (
          <div className="w-full flex flex-col items-center justify-center py-24">
            <Loader2 className="animate-spin text-gray-400 mb-4" size={48} />
            <p className="text-gray-500">Loading your favorites...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full animate-in fade-in duration-500">
            {filteredItems.map(doc => (
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
        ) : (
          <div className="w-full flex flex-col items-center justify-center py-24 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 border-dashed transition-colors">
            <div className="w-20 h-20 bg-amber-50 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-4">
              <Star className="text-amber-300 dark:text-amber-600/70" size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">No favorites found</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm">
              {searchQuery 
                ? `We couldn't find any favorites matching "${searchQuery}".` 
                : "You haven't saved any items to your favorites yet. Go to your Library and click the star icon to save documents here!"}
            </p>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="cursor-pointer mt-6 px-5 py-2 bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded-lg font-medium hover:bg-amber-100 dark:hover:bg-amber-800/50 transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
