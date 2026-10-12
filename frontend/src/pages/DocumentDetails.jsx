import React, { useCallback, useState } from 'react';
import { ArrowLeft, Loader2, ExternalLink, X, FileText, MessageSquare, ScrollText, RefreshCw, Lightbulb, CheckCircle2, Printer } from 'lucide-react';
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
    <div className="h-full overflow-y-auto bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 dark:text-white">Summary: <span className="font-medium">{document.title}</span></h3>
        <div className="flex items-center gap-2 print:hidden">
        {document.summary && (
          <button type="button" onClick={() => window.print()} aria-label="Print or save as PDF" className="p-2 rounded-lg text-gray-400 hover:text-amber-500 cursor-pointer"><Printer size={16} /></button>
        )}
        <button
          type="button"
          onClick={() => generate.mutate()}
          disabled={!ready || generate.isPending}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold bg-amber-500 text-[#0b1120] hover:bg-amber-600 disabled:opacity-50 cursor-pointer"
        >
          {generate.isPending ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          {document.summary ? 'Regenerate' : 'Generate summary'}
        </button>
        </div>
      </div>
      {generate.isError && <p className="text-sm text-red-500 mb-3">{getErrorMessage(generate.error)}</p>}
      {document.summary ? (
        <Markdown onCitation={onCitation} className="text-gray-800 dark:text-gray-100">{document.summary}</Markdown>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {ready ? 'Generate a concise study summary of this document: key concepts, definitions and how they connect.' : 'Available once the document has been processed.'}
        </p>
      )}
    </div>
  );
};

const DocumentDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: document, isLoading, isError } = useDocument(id);
  const { url: fileUrl, isError: fileFailed } = useDocumentFileUrl(id);
  const reprocess = useReprocessDocument(id);
  const explain = useExplainSelection(id);
  const makeFlashcard = useFlashcardFromSelection(id);

  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(() => Math.max(1, Number(searchParams.get('page')) || 1));
  const [tab, setTab] = useState('chat');
  const [draft, setDraft] = useState(null);
  const [panel, setPanel] = useState(null); // { kind: 'explain'|'flashcard', text, mode? }

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
      setPanel({ kind: 'error', message: 'Please wait until the document has finished processing.' });
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
    return <div className="flex items-center justify-center h-full text-gray-400"><Loader2 className="animate-spin" size={32} /></div>;
  }
  if (isError || !document) {
    return (
      <div className="p-10 text-center">
        <FileText size={48} className="mx-auto mb-4 text-gray-400" />
        <p className="font-bold text-gray-300 mb-4">Document not found</p>
        <Link to="/documents" className="text-amber-400 font-semibold">Back to library</Link>
      </div>
    );
  }

  const tabs = [
    { id: 'pdf', label: 'Document', icon: FileText, mobileOnly: true },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'summary', label: 'Summary', icon: ScrollText },
  ];

  return (
    <div className="flex flex-col h-full p-4 lg:p-6 gap-4 min-h-0">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={() => navigate('/documents')} className="flex items-center text-gray-400 hover:text-amber-400 text-sm font-semibold transition-colors cursor-pointer">
          <ArrowLeft size={16} className="mr-1" /> Library
        </button>
        <h1 className="text-base font-bold text-slate-100 truncate flex-1 min-w-0">{document.title}</h1>
        <DocumentStatus document={document} onRetry={() => reprocess.mutate()} retrying={reprocess.isPending} />
        {fileUrl && (
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-xs text-amber-400 hover:text-amber-300 font-medium gap-1">
            <ExternalLink size={14} /> Open PDF
          </a>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 lg:pl-[calc(55%+0.5rem)] xl:pl-[calc(60%+0.5rem)]" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`${t.mobileOnly ? 'lg:hidden' : ''} flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${tab === t.id ? 'bg-amber-500/15 text-amber-300' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
          >
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Viewer */}
        <div className={`${tab === 'pdf' ? 'flex' : 'hidden'} lg:flex flex-col w-full lg:w-[55%] xl:w-[60%] bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 min-h-0`}>
          {fileUrl ? (
            <PdfViewer fileUrl={fileUrl} page={page} onPageChange={setPage} onSelectionAction={handleSelectionAction} />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              {fileFailed ? 'Could not load the PDF.' : <Loader2 className="animate-spin" size={28} />}
            </div>
          )}
        </div>

        {/* Side panel */}
        <div className={`${tab === 'pdf' ? 'hidden lg:flex' : 'flex'} flex-1 flex-col gap-3 min-h-0 min-w-0`}>
          {panel && (
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl border border-amber-500/30 p-4 max-h-[45%] overflow-y-auto shrink-0">
              <button onClick={() => setPanel(null)} aria-label="Close" className="absolute top-3 right-3 p-1 rounded text-gray-400 hover:text-gray-200 cursor-pointer"><X size={16} /></button>
              {panel.kind === 'error' && <p className="text-sm text-amber-400 pr-6">{panel.message}</p>}
              {panel.kind === 'explain' && (
                <>
                  <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-amber-500 mb-2"><Lightbulb size={14} /> {panel.mode === 'simplify' ? 'In simple words' : 'Explanation'}</p>
                  <blockquote className="text-xs italic text-gray-500 dark:text-gray-400 border-l-2 border-amber-500/40 pl-2 mb-3 line-clamp-3">{panel.text}</blockquote>
                  {explain.isPending ? <Loader2 className="animate-spin text-amber-400" size={20} />
                    : explain.isError ? <p className="text-sm text-red-500">{getErrorMessage(explain.error)}</p>
                    : <Markdown className="text-gray-800 dark:text-gray-100">{explain.data}</Markdown>}
                </>
              )}
              {panel.kind === 'flashcard' && (
                makeFlashcard.isPending ? <p className="flex items-center gap-2 text-sm text-gray-400"><Loader2 className="animate-spin" size={16} /> Creating a flashcard...</p>
                  : makeFlashcard.isError ? <p className="text-sm text-red-500 pr-6">{getErrorMessage(makeFlashcard.error)}</p>
                  : makeFlashcard.data && (
                    <div className="pr-6">
                      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-emerald-500 mb-2"><CheckCircle2 size={14} /> Flashcard added</p>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{makeFlashcard.data.question}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{makeFlashcard.data.answer}</p>
                      <Link to="/flashcards" className="inline-block mt-2 text-xs font-semibold text-amber-500">Open flashcards</Link>
                    </div>
                  )
              )}
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
