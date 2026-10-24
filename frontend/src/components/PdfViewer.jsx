import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Loader2,
  Lightbulb,
  Wand2,
  Layers,
  MessageSquare,
  ScrollText,
  FileText,
} from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

const MIN_SCALE = 0.5;
const MAX_SCALE = 2.4;

const SELECTION_ACTIONS = [
  { id: 'explain', label: 'Explain', icon: Lightbulb },
  { id: 'simplify', label: 'Simplify', icon: Wand2 },
  { id: 'flashcard', label: 'Flashcard', icon: Layers },
  { id: 'ask', label: 'Ask in chat', icon: MessageSquare },
];

/**
 * In-app PDF viewer.
 * Supports continuous vertical scroll mode (top-to-down) by default,
 * with smooth page jumping, live page tracking, zoom, and text selection tools.
 */
const PdfViewer = ({ fileUrl, page = 1, onPageChange, onSelectionAction }) => {
  const containerRef = useRef(null);
  const isProgrammaticScroll = useRef(false);
  const scrollTimeout = useRef(null);

  const [numPages, setNumPages] = useState(null);
  const [prevPage, setPrevPage] = useState(page);
  const [currentPage, setCurrentPage] = useState(page);
  const [pageInput, setPageInput] = useState(String(page));
  const [width, setWidth] = useState(0);
  const [scale, setScale] = useState(1);
  const [selection, setSelection] = useState(null); // { text, top, left }
  const [loadError, setLoadError] = useState('');
  const [viewMode, setViewMode] = useState('scroll'); // 'scroll' (top to down) or 'single'

  // Adjust state during render if page prop changed from outside (React recommended pattern)
  if (page !== prevPage) {
    setPrevPage(page);
    setCurrentPage(page);
    setPageInput(String(page));
    setSelection(null);
  }

  // Fit the page to the container width; recompute on resize
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.floor(entry.contentRect.width));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Programmatically scroll to a specific page
  const scrollToPage = useCallback((targetPage, smooth = true) => {
    if (!containerRef.current || !targetPage) return;
    const pageEl = containerRef.current.querySelector(`[data-page-number="${targetPage}"]`);
    if (pageEl) {
      isProgrammaticScroll.current = true;
      pageEl.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
      clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 700);
    }
  }, []);

  // Sync external page changes to scroll position (DOM side effect only, no setState)
  useEffect(() => {
    if (viewMode === 'scroll' && page) {
      scrollToPage(page, true);
    }
  }, [page, viewMode, scrollToPage]);

  // Track the current visible page during continuous scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !numPages || viewMode !== 'scroll') return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScroll.current) return;
        const visible = entries.filter((e) => e.isIntersecting);
        if (!visible.length) return;

        // Choose the page with the highest visibility in the viewport
        visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const topPageNum = Number(visible[0].target.getAttribute('data-page-number'));

        if (topPageNum && topPageNum !== currentPage) {
          setCurrentPage(topPageNum);
          setPageInput(String(topPageNum));
          onPageChange?.(topPageNum);
        }
      },
      {
        root: container,
        threshold: [0.15, 0.4, 0.6, 0.8],
      }
    );

    const pageElements = container.querySelectorAll('[data-page-number]');
    pageElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [numPages, viewMode, width, scale, currentPage, onPageChange]);

  const goTo = (target) => {
    if (!numPages) return;
    const next = Math.min(numPages, Math.max(1, target));
    setCurrentPage(next);
    setPageInput(String(next));
    onPageChange?.(next);
    if (viewMode === 'scroll') {
      scrollToPage(next, true);
    }
  };

  const handleDocumentLoadSuccess = ({ numPages: n }) => {
    setNumPages(n);
    setLoadError('');
    if (page && page > 1) {
      setTimeout(() => {
        scrollToPage(page, false);
      }, 100);
    }
  };

  const handleMouseUp = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) {
      setSelection(null);
      return;
    }
    const text = sel.toString().replace(/\s+/g, ' ').trim();
    if (!text || text.length < 3 || !containerRef.current?.contains(sel.anchorNode)) {
      setSelection(null);
      return;
    }
    const rect = sel.getRangeAt(0).getBoundingClientRect();
    const box = containerRef.current.getBoundingClientRect();
    setSelection({
      text: text.slice(0, 2000),
      top: rect.top - box.top + containerRef.current.scrollTop - 48,
      left: Math.min(Math.max(rect.left - box.left + rect.width / 2, 130), box.width - 130),
    });
  };

  const runAction = (actionId) => {
    if (!selection) return;
    onSelectionAction?.(actionId, selection.text);
    setSelection(null);
    window.getSelection()?.removeAllRanges();
  };

  const handleScroll = () => {
    if (selection) setSelection(null);
  };

  // Compute page width for rendering
  const computedPageWidth = width > 0 ? Math.max(260, Math.floor((width - 40) * scale)) : 0;

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 pb-3 text-sm text-slate-300 border-b border-white/[0.06] mb-3">
        {/* Page navigation */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => goTo(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Previous page"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              goTo(Number(pageInput) || 1);
            }}
            className="flex items-center gap-1 text-xs"
          >
            <input
              aria-label="Page number"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value.replace(/\D/g, ''))}
              onBlur={() => setPageInput(String(currentPage))}
              className="w-12 text-center py-1 rounded-lg bg-white/[0.05] border border-white/[0.1] text-slate-200 focus:outline-none focus:border-amber-500/40 font-semibold"
            />
            <span className="text-slate-500">/ {numPages ?? '–'}</span>
          </form>
          <button
            type="button"
            onClick={() => goTo(currentPage + 1)}
            disabled={!numPages || currentPage >= numPages}
            aria-label="Next page"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* View mode toggle & zoom controls */}
        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center p-0.5 rounded-lg bg-white/[0.04] border border-white/[0.08]">
            <button
              type="button"
              onClick={() => setViewMode('scroll')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'scroll'
                  ? 'bg-amber-500/20 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.1)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Continuous scroll (top to down)"
            >
              <ScrollText size={14} />
              <span className="hidden sm:inline">Scroll</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('single')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'single'
                  ? 'bg-amber-500/20 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.1)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Single page view"
            >
              <FileText size={14} />
              <span className="hidden sm:inline">Page</span>
            </button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => setScale((s) => Math.max(MIN_SCALE, +(s - 0.15).toFixed(2)))}
              aria-label="Zoom out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] cursor-pointer transition-colors"
            >
              <ZoomOut size={16} />
            </button>
            <button
              type="button"
              onClick={() => setScale(1)}
              className="px-2 py-1 rounded-md text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.06] cursor-pointer transition-colors"
              title="Fit width (100%)"
            >
              {Math.round(scale * 100)}%
            </button>
            <button
              type="button"
              onClick={() => setScale((s) => Math.min(MAX_SCALE, +(s + 0.15).toFixed(2)))}
              aria-label="Zoom in"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] cursor-pointer transition-colors"
            >
              <ZoomIn size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Document Container */}
      <div
        ref={containerRef}
        onMouseUp={handleMouseUp}
        onScroll={handleScroll}
        className="relative flex-1 min-h-0 overflow-y-auto overflow-x-auto rounded-2xl bg-[#080d19]/80 border border-white/[0.04] p-4 select-text"
      >
        <Document
          file={fileUrl}
          onLoadSuccess={handleDocumentLoadSuccess}
          onLoadError={(err) => {
            console.error('PDF display error:', err);
            setLoadError('Could not display this PDF.');
          }}
          loading={
            <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-3">
              <Loader2 className="animate-spin text-amber-500" size={32} />
              <p className="text-xs font-medium">Loading PDF document...</p>
            </div>
          }
          error={<div className="p-8 text-center text-slate-500 text-sm">{loadError || 'Could not display this PDF.'}</div>}
        >
          {computedPageWidth > 0 && numPages && (
            <div className="flex flex-col items-center w-full min-w-fit">
              {viewMode === 'scroll' ? (
                // Top-to-down continuous scrollable pages
                Array.from({ length: numPages }, (_, index) => {
                  const pageNum = index + 1;
                  return (
                    <div
                      key={`page_${pageNum}`}
                      data-page-number={pageNum}
                      className="flex flex-col items-center mb-6 last:mb-2 group transition-all"
                    >
                      <div className="mb-1.5 text-[10px] font-bold text-slate-500 tracking-wider uppercase">
                        Page {pageNum} of {numPages}
                      </div>
                      <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/60 bg-white ring-1 ring-white/10">
                        <Page
                          pageNumber={pageNum}
                          width={computedPageWidth}
                          className="block"
                          renderAnnotationLayer
                          renderTextLayer
                          loading={
                            <div
                              style={{ width: computedPageWidth, height: Math.floor(computedPageWidth * 1.3) }}
                              className="flex items-center justify-center bg-slate-900/40 text-slate-500 text-xs"
                            >
                              <Loader2 className="animate-spin text-amber-500 mr-2" size={16} /> Loading page {pageNum}...
                            </div>
                          }
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                // Single page mode
                <div
                  data-page-number={currentPage}
                  className="flex flex-col items-center my-2"
                >
                  <div className="mb-1.5 text-[10px] font-bold text-slate-500 tracking-wider uppercase">
                    Page {currentPage} of {numPages}
                  </div>
                  <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/60 bg-white ring-1 ring-white/10">
                    <Page
                      pageNumber={Math.min(currentPage, numPages || currentPage)}
                      width={computedPageWidth}
                      className="block"
                      renderAnnotationLayer
                      renderTextLayer
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </Document>

        {/* Text Selection Action Popup */}
        {selection && (
          <div
            role="toolbar"
            aria-label="Selection actions"
            style={{ top: Math.max(8, selection.top), left: selection.left }}
            className="absolute z-30 -translate-x-1/2 flex items-center gap-0.5 p-1.5 rounded-xl bg-[#0f172a] border border-amber-500/30 shadow-2xl shadow-amber-500/10 backdrop-blur-md animate-scale-in"
            onMouseUp={(e) => e.stopPropagation()}
          >
            {SELECTION_ACTIONS.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() => runAction(action.id)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-200 hover:bg-white/10 hover:text-amber-300 whitespace-nowrap cursor-pointer transition-all"
              >
                <action.icon size={13} className="text-amber-400" /> {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfViewer;
