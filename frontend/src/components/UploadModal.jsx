import React, { useRef, useState } from 'react';
import { UploadCloud, X, CheckCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUploadDocument } from '../api/hooks';
import { getErrorMessage } from '../lib/api';

const MAX_BYTES = 10 * 1024 * 1024;

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
    // Reset all state when closing so the modal is fresh next time
    setErrorMsg('');
    setUploadSuccess(false);
    upload.reset();
    onClose();
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => { setIsDragging(false); };
  const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); handleFileSelection(e.dataTransfer.files[0]); };

  const handleFileSelection = (file) => {
    if (!file) return;
    setErrorMsg('');

    // Accept both MIME type and extension (iOS sometimes reports application/octet-stream)
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      setErrorMsg('Only PDF files are supported.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setErrorMsg('File is too large (max. 10MB).');
      return;
    }
    if (file.size === 0) {
      setErrorMsg('The selected file is empty. Please choose a valid PDF.');
      return;
    }
    upload.mutate({ file, title: file.name.replace(/\.pdf$/i, '') }, {
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
        setErrorMsg(getErrorMessage(error, 'Error uploading file. Please try again.'));
        // Reset the file input so the same file can be tried again
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="glass-card rounded-2xl w-full max-w-lg overflow-hidden animate-scale-in">
        <div className="flex justify-between items-center p-5 border-b border-white/[0.06]">
          <h3 className="text-lg font-bold text-white">Upload Document</h3>
          <button onClick={handleClose} className="text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] p-1.5 rounded-lg transition-all duration-200 cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {uploadSuccess ? (
            <div className="flex flex-col items-center justify-center py-10 animate-scale-in">
              <div className="text-emerald-400 mb-4 p-4 rounded-full bg-emerald-500/10 shadow-lg shadow-emerald-500/10">
                <CheckCircle size={48} />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Upload Complete!</h4>
              <p className="text-sm text-slate-400 text-center">Your document has been added and is being processed by AI.</p>
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all duration-300 ${
                isDragging
                  ? 'border-amber-500/60 bg-amber-500/[0.06] shadow-[inset_0_0_30px_rgba(245,158,11,0.05)]'
                  : 'border-white/[0.08] hover:border-amber-500/30 hover:bg-white/[0.02]'
              }`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="w-12 h-12 border-3 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-4"></div>
                  <p className="text-sm font-bold text-white">Uploading your document...</p>
                  <p className="text-xs text-slate-500 mt-2">Saving file to storage</p>
                </div>
              ) : (
                <>
                  <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                    <UploadCloud size={32} />
                  </div>
                  <h4 className="text-base font-bold text-white mb-1">Click to upload or drag and drop</h4>
                  <p className="text-sm text-slate-500">PDF only · max. 10MB</p>
                  {errorMsg && <p className="text-xs text-red-400 font-semibold mt-3 animate-scale-in">{errorMsg}</p>}

                  <label className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-white/[0.06] border border-white/[0.08] text-slate-200 hover:bg-white/[0.1] hover:border-amber-500/30 hover:text-amber-300 transition-all duration-200 cursor-pointer btn-press">
                    Browse Files
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept=".pdf,application/pdf"
                      onChange={(e) => { handleFileSelection(e.target.files[0]); e.target.value = ''; }}
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
