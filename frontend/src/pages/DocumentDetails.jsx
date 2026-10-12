import React from 'react';
import ChatInterface from '../components/ChatInterface';
import { ArrowLeft, FileText, Loader2, ExternalLink } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDocument, useDocumentFileUrl } from '../api/hooks';

const DocumentDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: document, isLoading: loading } = useDocument(id);
  // PDFs are private: fetched through the authenticated API and shown from a local blob URL.
  const { url: fileUrl, isError: fileFailed } = useDocumentFileUrl(id);
  const fileError = fileFailed ? 'Could not load the PDF.' : '';

  return (
    <div className="flex gap-4 h-full p-4 lg:p-6 w-full max-h-screen">
      {/* Sidebar / Document Viewer */}
      <div className="w-1/2 lg:w-[55%] xl:w-[60%] bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 lg:p-6 flex-col hidden lg:flex transition-colors relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/documents')}
            className="flex items-center text-gray-500 hover:text-indigo-600 text-sm font-semibold transition-colors cursor-pointer w-fit"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Library
          </button>
          {fileUrl && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-xs text-indigo-500 hover:text-indigo-700 font-medium transition-colors gap-1"
            >
              <ExternalLink size={14} />
              Open PDF
            </a>
          )}
        </div>

        <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center overflow-hidden relative transition-colors">
          {loading || (!fileUrl && !fileError) ? (
            <div className="flex flex-col items-center text-gray-400">
              <Loader2 className="animate-spin mb-2" size={32} />
              <p>Loading document...</p>
            </div>
          ) : fileUrl ? (
            <iframe
              src={fileUrl}
              className="w-full h-full absolute inset-0 rounded-xl border-0"
              title={document.title}
              allow="autoplay"
            />
          ) : (
            <div className="text-gray-400 text-center">
              <FileText size={64} className="mb-4 opacity-50 mx-auto" />
              <p className="font-bold text-gray-500">{fileError || 'Document Not Found'}</p>
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
