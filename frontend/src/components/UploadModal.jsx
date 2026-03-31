import React, { useState } from 'react';
import { UploadCloud, X, FileText, CheckCircle } from 'lucide-react';

const UploadModal = ({ isOpen, onClose }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelection(e.dataTransfer.files[0]);
  };

  const handleFileSelection = (file) => {
    if (file) {
      setIsUploading(true);
      // Simulate upload and loading states for AI generation
      setTimeout(() => {
        setIsUploading(false);
        setUploadSuccess(true);
        setTimeout(() => {
          setUploadSuccess(false);
          onClose();
        }, 2000);
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 dark:bg-gray-900/80 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Upload Document</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 rounded-lg transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          {uploadSuccess ? (
            <div className="flex flex-col items-center justify-center py-10 fade-in animate-in">
              <div className="text-emerald-500 mb-4 bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-full">
                <CheckCircle size={48} />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Upload Complete!</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Your document has been added to the library and is being processed by AI.</p>
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-colors ${
                isDragging ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="w-12 h-12 border-4 border-indigo-100 dark:border-indigo-900/50 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin mb-4"></div>
                  <p className="text-sm font-bold text-indigo-900 dark:text-indigo-100">Uploading and Processing...</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Extracting robust context for Chat and Quizzes</p>
                </div>
              ) : (
                <>
                  <div className="bg-indigo-50 dark:bg-indigo-900/40 p-4 rounded-full text-indigo-600 dark:text-indigo-400 mb-4">
                    <UploadCloud size={32} />
                  </div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">Click to upload or drag and drop</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">PDF, DOCX, or TXT (max. 50MB)</p>
                  
                  <label className="mt-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-colors cursor-pointer">
                    Browse Files
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={(e) => handleFileSelection(e.target.files[0])}
                    />
                  </label>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
