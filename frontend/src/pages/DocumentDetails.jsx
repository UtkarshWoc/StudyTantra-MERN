import React, { useState, useEffect } from 'react';
import ChatInterface from '../components/ChatInterface';
import { ArrowLeft, FileText, Loader2 } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const DocumentDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  
  const [document, setDocument] = useState(location.state?.document || null);
  const [loading, setLoading] = useState(!document);

  useEffect(() => {
    if (!document && user) {
      const fetchDoc = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/documents/${id}`, config);
          setDocument(data);
        } catch (error) {
          console.error("Error fetching doc:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchDoc();
    }
  }, [id, document, user]);

  return (
    <div className="flex gap-4 h-full p-4 lg:p-6 w-full max-h-screen">
      {/* Sidebar / Document Viewer Placeholder */}
      <div className="w-1/2 lg:w-[55%] xl:w-[60%] bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 lg:p-6 flex-col hidden lg:flex transition-colors relative overflow-hidden">
        <button 
          onClick={() => navigate('/documents')}
          className="flex items-center text-gray-500 hover:text-indigo-600 mb-6 text-sm font-semibold transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Library
        </button>
        
        <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center overflow-hidden relative transition-colors">
          {loading ? (
             <div className="flex flex-col items-center text-gray-400">
               <Loader2 className="animate-spin mb-2" size={32} />
               <p>Loading document...</p>
             </div>
          ) : document ? (
             <embed 
               src={`${process.env.REACT_APP_API_URL}/${document.filePath.replace(/\\/g, '/')}`} 
               type="application/pdf" 
               className="w-full h-full absolute inset-0 rounded-xl" 
               title={document.title}
             />
          ) : (
            <div className="text-gray-400 text-center">
              <FileText size={64} className="mb-4 opacity-50 mx-auto" />
              <p className="font-bold text-gray-500">Document Not Found</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 h-full flex flex-col">
        <div className="md:hidden mb-4">
           <button 
             onClick={() => navigate('/documents')}
             className="flex items-center text-gray-500 hover:text-indigo-600 text-sm font-semibold transition-colors cursor-pointer w-fit"
           >
             <ArrowLeft size={16} className="mr-1" />
             Back
           </button>
        </div>
        <ChatInterface documentId={id} documentTitle={document?.title} />
      </div>
    </div>
  );
};

export default DocumentDetails;
