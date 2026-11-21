import React, { useRef, useState } from 'react';
import { X, CheckCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUploadDocument } from '../api/hooks';
import { getErrorMessage } from '../lib/api';

const MAX_BYTES = 4.5 * 1024 * 1024;

const UploadModal = ({ isOpen, onClose }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const upload = useUploadDocument();
  const isUploading = upload.isPending;

  if (!isOpen) return null;

  const handleClose = () => {
    setErrorMsg('');
    setUploadSuccess(false);
    upload.reset();
    onClose();
  };

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
    if (!file) return;
    setErrorMsg('');

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      setErrorMsg('Only PDF files are currently supported.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setErrorMsg('File is too large (maximum 4.5MB for deployed serverless hosting). Please choose a smaller PDF.');
      return;
    }
    if (file.size === 0) {
      setErrorMsg('The selected file is empty. Please choose a valid PDF.');
      return;
    }
    upload.mutate(
      { file, title: file.name.replace(/\.pdf$/i, '') },
      {
        onSuccess: (doc) => {
          setUploadSuccess(true);
          setTimeout(() => {
            setUploadSuccess(false);
            upload.reset();
            onClose();
            navigate(`/documents/${doc._id}`);
          }, 1200);
        },
        onError: (error) => {
          const isNetworkError = !error?.response || error?.message === 'Network Error' || error?.code === 'ERR_NETWORK';
          if (isNetworkError) {
            setErrorMsg(
              'Upload failed (Network Error). On deployed hosting (Vercel), requests over 4.5MB or server cold-starts cause the edge proxy to drop the connection. Please ensure your PDF is under 4.5MB and try again.'
            );
          } else {
            setErrorMsg(getErrorMessage(error, 'Error uploading file. Please try again.'));
          }
          if (fileInputRef.current) fileInputRef.current.value = '';
        },
      }
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 font-body"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="relative bg-surface-container-lowest rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-outline-variant/30 animate-scale-in">
        {/* Soft Accent Trim Top Line */}
        <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full opacity-60" />

        <div className="flex justify-between items-center p-6 border-b border-outline-variant/30">
          <div>
            <h3 className="font-headline text-2xl font-bold text-on-surface">Upload Academic Document</h3>
            <p className="text-xs text-on-surface-variant font-label mt-0.5">
              Ingest syllabi, research papers, or lecture slides for FSRS synthesis
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container p-2 rounded-xl transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {uploadSuccess ? (
            <div className="flex flex-col items-center justify-center py-10 animate-scale-in">
              <div className="text-emerald-600 mb-4 p-4 rounded-full bg-emerald-100 dark:bg-emerald-950/40 shadow-sm">
                <CheckCircle size={48} />
              </div>
              <h4 className="font-headline text-2xl font-bold text-on-surface mb-1">Upload Complete!</h4>
              <p className="text-xs text-on-surface-variant text-center max-w-xs font-body">
                Your academic document is now ingested. Redirecting to workspace...
              </p>
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300 ${
                isDragging
                  ? 'border-primary bg-primary-fixed/20 shadow-inner'
                  : 'border-outline-variant/60 hover:border-primary/50 hover:bg-surface-container-low'
              }`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="w-12 h-12 border-3 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                  <p className="font-headline text-lg font-bold text-on-surface mb-1">Synthesizing Document...</p>
                  <p className="text-xs text-on-surface-variant">Extracting text, LaTeX formulas, and page structure</p>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary mb-4 shadow-xs">
                    <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                  </div>
                  <h4 className="font-headline text-xl font-bold text-on-surface mb-1">
                    Drag and drop your academic PDF here
                  </h4>
                  <p className="text-xs text-on-surface-variant mb-5 max-w-xs leading-relaxed">
                    Automatic equation parsing, OCR detection, and spaced recall generation.
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={(e) => handleFileSelection(e.target.files[0])}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-on-primary text-xs font-label font-semibold shadow-sm transition-all cursor-pointer"
                  >
                    Browse Local File
                  </label>

                  <span className="text-[11px] text-outline font-label mt-4">
                    Maximum file size: 4.5MB • Format: PDF
                  </span>
                </>
              )}
            </div>
          )}

          {errorMsg && (
            <div className="mt-4 p-3 rounded-xl text-xs font-semibold bg-error-container text-on-error-container border border-error/20 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-error shrink-0">error</span>
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
