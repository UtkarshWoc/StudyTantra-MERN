import React from 'react';
import ChatInterface from '../components/ChatInterface';
import { ArrowLeft, FileText } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const DocumentDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {/* Sidebar / Document Viewer Placeholder */}
      <div className="w-1/2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex-col hidden lg:flex">
        <button 
          onClick={() => navigate('/documents')}
          className="flex items-center text-gray-500 hover:text-indigo-600 mb-6 text-sm font-semibold transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Library
        </button>
        
        <div className="flex-1 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
          <FileText size={64} className="mb-4 opacity-50" />
          <p className="font-bold text-gray-500">PDF Viewer Component</p>
          <p className="text-xs mt-2 font-medium">Document ID: {id}</p>
          <p className="text-xs mt-1">(To be implemented in future phase)</p>
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
        <ChatInterface />
      </div>
    </div>
  );
};

export default DocumentDetails;
