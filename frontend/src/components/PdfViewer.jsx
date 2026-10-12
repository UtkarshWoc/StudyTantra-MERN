import React, { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader2, Lightbulb, Wand2, Layers, MessageSquare } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

const MIN_SCALE = 0.6;
const MAX_SCALE = 2.4;

const SELECTION_ACTIONS = [
  { id: 'explain', label: 'Explain', icon: Lightbulb },
  { id: 'simplify', label: 'Simplify', icon: Wand2 },
  { id: 'flashcard', label: 'Flashcard', icon: Layers },
  { id: 'ask', label: 'Ask in chat', icon: MessageSquare },
];

/**
 * In-app PDF viewer. `page` is controlled so citations elsewhere can jump to a
 * page. Selecting text shows a toolbar; onSelectionAction(actionId, text) fires.
 */
const PdfViewer = ({ fileUrl, page, onPageChange, onSelectionAction }) => {
  const containerRef = useRef(null);
  const [numPages, setNumPages] = useState(null);
  const [width, setWidth] = useState(0);
  const [scale, setScale] = useState(1);
  const [pageInput, setPageInput] = useState(String(page));
  const [selection, setSelection] = useState(null); // { text, top, left }
  const [loadError, setLoadError] = useState('');

  // Fit the page to the container width; recompute on resize
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const [shownPage, setShownPage] = useState(page);
  if (page !== shownPage) {
    // Page changed from outside (e.g. a citation click): sync the input and drop any selection
    setShownPage(page);
    setPageInput(String(page));
    setSelection(null);
  }

  const goTo = (target) => {
    if (!numPages) return;
    const next = Math.min(numPages, Math.max(1, target));
    onPageChange(next);
  };

  const handleMouseUp = () => {
    const sel = window.getSelection();
    const text = sel?.toString().replace(/\s+/g, ' ').trim();
    if (!text || text.length < 3 || !containerRef.current?.contains(sel.anchorNode)) {
      setSelection(null);
      return;
    }
    const rect = sel.getRangeAt(0).getBoundingClientRect();
    const box = containerRef.current.getBoundingClientRect();
    setSelection({
      text: text.slice(0, 2000),
      top: rect.top - box.top + containerRef.current.scrollTop - 48,
      left: Math.min(Math.max(rect.left - box.left + rect.width / 2, 120), box.width - 120),
    });
  };

  const runAction = (actionId) => {
    if (!selection) return;
    onSelectionAction?.(actionId, selection.text);
    setSelection(null);
    window.getSelection()?.removeAllRanges();
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 pb-3 text-sm text-gray-600 dark:text-gray-300">
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => goTo(page - 1)} disabled={page <= 1} aria-label="Previous page" className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 cursor-pointer"><ChevronLeft size={18} /></button>
          <form onSubmit={(e) => { e.preventDefault(); goTo(Number(pageInput) || 1); }} className="flex items-center gap-1">
            <input
              aria-label="Page number"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value.replace(/\D/g, ''))}
              onBlur={() => setPageInput(String(page))}
              className="w-12 text-center px-1 py-1 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
            />
            <span className="text-gray-400">/ {numPages ?? '–'}</span>
          </form>
          <button type="button" onClick={() => goTo(page + 1)} disabled={!numPages || page >= numPages} aria-label="Next page" className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 cursor-pointer"><ChevronRight size={18} /></button>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => setScale((s) => Math.max(MIN_SCALE, +(s - 0.2).toFixed(1)))} aria-label="Zoom out" className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"><ZoomOut size={18} /></button>
          <button type="button" onClick={() => setScale(1)} className="px-2 py-1 rounded-md text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer" title="Fit width">{Math.round(scale * 100)}%</button>
          <button type="button" onClick={() => setScale((s) => Math.min(MAX_SCALE, +(s + 0.2).toFixed(1)))} aria-label="Zoom in" className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"><ZoomIn size={18} /></button>
        </div>
      </div>

      {/* Page */}
      <div
        ref={containerRef}
        onMouseUp={handleMouseUp}
        className="relative flex-1 min-h-0 overflow-auto rounded-xl bg-gray-100 dark:bg-gray-900"
      >
        <Document
          file={fileUrl}
          onLoadSuccess={({ numPages: n }) => { setNumPages(n); setLoadError(''); }}
          onLoadError={() => setLoadError('Could not display this PDF.')}
          loading={<div className="flex items-center justify-center h-64 text-gray-400"><Loader2 className="animate-spin" size={28} /></div>}
          error={<div className="p-8 text-center text-gray-500">{loadError || 'Could not display this PDF.'}</div>}
        >
          {width > 0 && (
            <Page
              pageNumber={Math.min(page, numPages || page)}
              width={Math.floor(width * scale) - 16}
              className="mx-auto my-2 shadow-md"
              renderAnnotationLayer
              renderTextLayer
            />
          )}
        </Document>

        {selection && (
          <div
            role="toolbar"
            aria-label="Selection actions"
            style={{ top: Math.max(4, selection.top), left: selection.left }}
            className="absolute z-20 -translate-x-1/2 flex items-center gap-0.5 p-1 rounded-xl bg-[#111827] border border-[#334155] shadow-2xl"
            onMouseUp={(e) => e.stopPropagation()}
          >
            {SELECTION_ACTIONS.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() => runAction(action.id)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-200 hover:bg-white/10 hover:text-amber-300 whitespace-nowrap cursor-pointer"
              >
                <action.icon size={14} /> {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfViewer;
