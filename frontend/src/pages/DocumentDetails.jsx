import React, { useCallback, useState } from 'react';
import {
  ArrowLeft,
  Loader2,
  ExternalLink,
  X,
  FileText,
  MessageSquare,
  ScrollText,
  RefreshCw,
  Lightbulb,
  CheckCircle2,
  Printer,
} from 'lucide-react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import ChatInterface from '../components/ChatInterface';
import PdfViewer from '../components/PdfViewer';
import Markdown from '../components/Markdown';
import DocumentStatus from '../components/DocumentStatus';
import {
  useDocument,
  useDocumentFileUrl,
  useReprocessDocument,
  useGenerateSummary,
  useExplainSelection,
  useFlashcardFromSelection,
} from '../api/hooks';
import { getErrorMessage } from '../lib/api';

const SummaryPanel = ({ document, onCitation }) => {
  const generate = useGenerateSummary(document._id);
  const ready = document.status === 'ready';

  return (
    <div className="h-full overflow-y-auto bg-surface-container-low rounded-2xl p-6 border border-outline-variant/30 shadow-xs font-body">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-outline-variant/30">
        <div>
          <h3 className="font-headline text-lg font-bold text-on-surface">Document Summary</h3>
          <p className="text-xs text-on-surface-variant font-label truncate max-w-sm">
            {document.title}
          </p>
        </div>
        <div className="flex items-center gap-2 print:hidden">
          {document.summary && (
            <button
              type="button"
              onClick={() => window.print()}
              aria-label="Print or save as PDF"
              className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all cursor-pointer"
            >
              <Printer size={16} />
            </button>
          )}
          <button
            type="button"
            onClick={() => generate.mutate()}
            disabled={!ready || generate.isPending}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-label font-semibold bg-primary text-on-primary hover:bg-primary/95 disabled:opacity-50 cursor-pointer shadow-xs"
          >
            {generate.isPending ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
            {document.summary ? 'Regenerate' : 'Generate Summary'}
          </button>
        </div>
      </div>

      {generate.isError && (
        <p className="text-xs text-error mb-3 p-2 rounded-lg bg-error-container">
          {getErrorMessage(generate.error)}
        </p>
      )}

      {document.summary ? (
        <Markdown onCitation={onCitation} className="text-on-surface text-xs sm:text-sm leading-relaxed">
          {document.summary}
        </Markdown>
      ) : (
        <div className="p-6 text-center text-on-surface-variant text-xs">
          <span className="material-symbols-outlined text-3xl text-outline mb-2">menu_book</span>
          <p className="font-headline text-base text-on-surface font-semibold mb-1">No summary yet</p>
          <p className="max-w-xs mx-auto leading-relaxed">
            {ready
              ? 'Click "Generate Summary" to generate an overview of this document.'
              : 'Available once document processing completes.'}
          </p>
        </div>
      )}
    </div>
  );
};

const DocumentDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: document, isLoading, isError } = useDocument(id);
  const { url: fileUrl, blob: fileBlob, isError: fileFailed } = useDocumentFileUrl(id);
  const reprocess = useReprocessDocument(id);
  const explain = useExplainSelection(id);
  const makeFlashcard = useFlashcardFromSelection(id);

  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(() => Math.max(1, Number(searchParams.get('page')) || 1));
  const [tab, setTab] = useState('chat');
  const [draft, setDraft] = useState(null);
  const [panel, setPanel] = useState(null);

  const ready = document?.status === 'ready';

  const jumpToPage = useCallback((p) => {
    setPage(p);
    setTab((t) => (t === 'pdf' || window.matchMedia('(max-width: 1023px)').matches ? 'pdf' : t));
  }, []);

  const handleSelectionAction = (action, text) => {
    if (action === 'ask') {
      setDraft({ text: `Explain this from the document: "${text}"` });
      setTab('chat');
      return;
    }
    if (!ready) {
      setPanel({ kind: 'error', message: 'Please wait until document ingestion finishes.' });
      return;
    }
    if (action === 'flashcard') {
      setPanel({ kind: 'flashcard', text });
      makeFlashcard.mutate(text);
    } else {
      setPanel({ kind: 'explain', text, mode: action });
      explain.mutate({ text, mode: action });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-on-surface-variant py-24 gap-3">
        <Loader2 className="animate-spin text-primary" size={36} />
        <p className="font-headline text-base">Loading document...</p>
      </div>
    );
  }
  if (isError || !document) {
    return (
      <div className="p-10 text-center animate-fade-in bg-surface-container-low rounded-2xl max-w-md mx-auto my-12 border border-outline-variant/30">
        <FileText size={48} className="mx-auto mb-3 text-outline" />
        <h2 className="font-headline text-2xl font-bold text-on-surface mb-2">Document not found</h2>
        <p className="text-xs text-on-surface-variant mb-6">
          The requested document could not be found.
        </p>
        <Link to="/documents" className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold">
          ← Back to Library
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'pdf', label: 'Document', icon: FileText, mobileOnly: true },
    { id: 'chat', label: 'AI Chat', icon: MessageSquare },
    { id: 'summary', label: 'Summary', icon: ScrollText },
  ];

  return (
    <div className="flex flex-col h-full p-4 lg:p-6 gap-3.5 min-h-0 animate-fade-in font-body">
      {/* Top Utility & Metadata Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 shadow-xs">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={() => navigate('/documents')}
            className="flex items-center gap-1 text-on-surface-variant hover:text-primary text-xs font-label font-semibold transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft size={16} /> Library
          </button>
          <span className="text-outline text-xs">/</span>
          <h1 className="font-headline text-base sm:text-lg font-bold text-on-surface truncate">
            {document.title}
          </h1>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <DocumentStatus
            document={document}
            onRetry={() => reprocess.mutate()}
            retrying={reprocess.isPending}
          />
          {fileUrl && (
            <a
              href={fileUrl}
              download={document.filename}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-label font-semibold text-primary transition-colors shadow-xs"
            >
              <ExternalLink size={13} /> Open PDF
            </a>
          )}
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="flex items-center justify-between gap-2" role="tablist">
        <div className="flex items-center gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`${
                t.mobileOnly ? 'lg:hidden' : ''
              } flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-label font-semibold transition-all cursor-pointer ${
                tab === t.id
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[11px] text-on-surface-variant font-label">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <span>OCR Grounding Active</span>
        </div>
      </div>

      {/* Main Split Body: PDF Viewer (60%) & Copilot/Summary (40%) */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* PDF Reader */}
        <div
          className={`${
            tab === 'pdf' ? 'flex' : 'hidden'
          } lg:flex flex-col w-full lg:w-[58%] xl:w-[62%] bg-surface-container-low rounded-2xl p-3 sm:p-4 border border-outline-variant/30 min-h-0 shadow-xs`}
        >
          {fileBlob || fileUrl ? (
            <PdfViewer
              fileUrl={fileBlob || fileUrl}
              page={page}
              onPageChange={setPage}
              onSelectionAction={handleSelectionAction}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-on-surface-variant gap-2">
              {fileFailed ? (
                'Could not load the PDF source.'
              ) : (
                <>
                  <Loader2 className="animate-spin text-primary" size={28} />
                  <span className="text-xs font-label">Streaming document pages...</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Side Panel: Copilot / Summary */}
        <div className={`${tab === 'pdf' ? 'hidden lg:flex' : 'flex'} flex-1 flex-col gap-3 min-h-0 min-w-0`}>
          {panel && (
            <div className="relative bg-surface-container-lowest rounded-2xl border border-primary/30 p-4 max-h-[45%] overflow-y-auto shrink-0 shadow-md animate-slide-down font-body">
              <button
                onClick={() => setPanel(null)}
                aria-label="Close"
                className="absolute top-3 right-3 p-1 rounded text-outline hover:text-on-surface cursor-pointer"
              >
                <X size={16} />
              </button>
              {panel.kind === 'error' && (
                <p className="text-xs text-error font-medium pr-6">{panel.message}</p>
              )}
              {panel.kind === 'explain' && (
                <>
                  <p className="flex items-center gap-1.5 text-[11px] font-label font-bold uppercase tracking-wider text-primary mb-2">
                    <Lightbulb size={14} /> {panel.mode === 'simplify' ? 'Simplified Explanation' : 'Conceptual Breakdown'}
                  </p>
                  <blockquote className="text-xs italic text-on-surface-variant border-l-2 border-primary/40 pl-2.5 mb-3 line-clamp-3">
                    {panel.text}
                  </blockquote>
                  {explain.isPending ? (
                    <Loader2 className="animate-spin text-primary" size={20} />
                  ) : explain.isError ? (
                    <p className="text-xs text-error">{getErrorMessage(explain.error)}</p>
                  ) : (
                    <Markdown className="text-on-surface text-xs leading-relaxed">{explain.data}</Markdown>
                  )}
                </>
              )}
              {panel.kind === 'flashcard' &&
                (makeFlashcard.isPending ? (
                  <p className="flex items-center gap-2 text-xs text-on-surface-variant">
                    <Loader2 className="animate-spin text-primary" size={16} /> Creating flashcard...
                  </p>
                ) : makeFlashcard.isError ? (
                  <p className="text-xs text-error pr-6">{getErrorMessage(makeFlashcard.error)}</p>
                ) : (
                  makeFlashcard.data && (
                    <div className="pr-6">
                      <p className="flex items-center gap-1.5 text-[11px] font-label font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-2">
                        <CheckCircle2 size={14} /> Flashcard Created
                      </p>
                      <p className="text-xs font-bold text-on-surface">{makeFlashcard.data.question}</p>
                      <p className="text-xs text-on-surface-variant mt-1">{makeFlashcard.data.answer}</p>
                      <Link to="/flashcards" className="inline-block mt-2.5 text-xs font-semibold text-primary hover:underline">
                        View Flashcards →
                      </Link>
                    </div>
                  )
                ))}
            </div>
          )}

          <div className="flex-1 min-h-0">
            {tab === 'summary' ? (
              <SummaryPanel document={document} onCitation={jumpToPage} />
            ) : (
              <ChatInterface
                documentId={id}
                documentTitle={document.title}
                ready={ready}
                onCitation={jumpToPage}
                draft={draft}
                onDraftUsed={() => setDraft(null)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetails;
