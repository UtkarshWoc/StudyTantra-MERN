import React from 'react';
import { Loader2, AlertTriangle, CheckCircle2, ScanText } from 'lucide-react';

/**
 * Sahara styled badge for a document's ingestion state.
 */
const DocumentStatus = ({ document, onRetry, retrying, compact = false }) => {
  if (!document) return null;

  if (document.status === 'processing') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-label font-semibold text-primary" role="status">
        <Loader2 size={13} className="animate-spin" />
        Processing{document.progress ? ` ${document.progress}%` : '...'}
      </span>
    );
  }

  if (document.status === 'failed') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-label font-semibold text-error" role="alert">
        <AlertTriangle size={13} />
        {compact ? 'Failed' : document.processingError || 'Processing failed'}
        {onRetry && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRetry();
            }}
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
    return document.ocr ? (
      <span className="inline-flex items-center gap-1 text-[11px] font-label text-on-surface-variant bg-surface-container px-1.5 py-0.5 rounded" title="Text recognised with OCR">
        <ScanText size={12} /> OCR
      </span>
    ) : null;
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-label font-semibold text-emerald-700 dark:text-emerald-400">
      <CheckCircle2 size={13} />
      Ready{document.pageCount ? ` · ${document.pageCount} page${document.pageCount === 1 ? '' : 's'}` : ''}
      {document.ocr ? ' · OCR' : ''}
    </span>
  );
};

export default DocumentStatus;
