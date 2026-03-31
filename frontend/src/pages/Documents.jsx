import React, { useState } from 'react';
import DocumentCard from '../components/DocumentCard';
import UploadModal from '../components/UploadModal';
import { UploadCloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Documents = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);

  const handleDelete = (id) => {
    setDocuments(documents.filter(doc => doc.id !== id));
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {documents.map((doc) => (
          <div key={doc.id} onClick={() => navigate(`/documents/${doc.id}`)}>
             <DocumentCard 
               title={doc.title} 
               size={doc.size} 
               date={doc.date} 
               onDelete={() => handleDelete(doc.id)} 
             />
          </div>
        ))}
      </div>

      {documents.length === 0 && (
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
