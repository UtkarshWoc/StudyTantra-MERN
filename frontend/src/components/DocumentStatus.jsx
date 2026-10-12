import React from 'react';
import { Loader2, AlertTriangle, CheckCircle2, ScanText } from 'lucide-react';

/**
 * Small badge for a document's ingestion state. `compact` hides the label text
 * for "ready" so library cards stay quiet once everything works.
 */
const DocumentStatus = ({ document, onRetry, retrying, compact = false }) => {
  if (!document) return null;

  if (document.status === 'processing') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-300" role="status">
        <Loader2 size={14} className="animate-spin" />
        Processing{document.progress ? ` ${document.progress}%` : '...'}
      </span>
    );
  }

  if (document.status === 'failed') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400" role="alert">
        <AlertTriangle size={14} />
        {compact ? 'Failed' : document.processingError || 'Processing failed'}
        {onRetry && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRetry(); }}
            disabled={retrying}
            className="ml-1 underline cursor-pointer disabled:opacity-50"
          >
            {retrying ? 'Retrying...' : 'Retry'}
          </button>
        )}
      </span>
    );
  }

  if (compact) {
    return document.ocr ? <span className="inline-flex items-center gap-1 text-xs text-slate-400" title="Text recognised with OCR"><ScanText size={13} /> OCR</span> : null;
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
      <CheckCircle2 size={14} />
      Ready{document.pageCount ? ` · ${document.pageCount} page${document.pageCount === 1 ? '' : 's'}` : ''}{document.ocr ? ' · OCR' : ''}
    </span>
  );
};

export default DocumentStatus;
