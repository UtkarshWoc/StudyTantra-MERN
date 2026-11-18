import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ChatInterface from '../components/ChatInterface';
import QuizEngine from '../components/QuizEngine';
import GenerationOptions from '../components/GenerationOptions';
import DocumentStatus from '../components/DocumentStatus';
import { useCollection, useCollectionQuizzes, useGenerateCollectionQuiz } from '../api/hooks';
import { getErrorMessage } from '../lib/api';
import { defaultOptions, toRequestBody } from '../lib/generation';

const CollectionQuizzes = ({ collectionId, ready }) => {
  const { data: quizzes = [], isLoading } = useCollectionQuizzes(collectionId);
  const generate = useGenerateCollectionQuiz(collectionId);
  const [options, setOptions] = useState(() => defaultOptions('quiz'));
  const [pickedId, setPickedId] = useState('');
  const active = quizzes.find((q) => q._id === pickedId) || quizzes[0];

  return (
    <div className="space-y-6">
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 md:p-8 shadow-[0_2px_16px_rgba(58,48,42,0.04)] space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
          <span className="p-2 rounded-xl bg-primary-fixed text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">bolt</span>
          </span>
          <div>
            <h3 className="font-headline text-lg font-bold text-on-surface">Generate Collection Quiz</h3>
            <p className="text-xs text-on-surface-variant">Generate cross-cutting questions spanning all linked documents in this collection.</p>
          </div>
        </div>

        <GenerationOptions kind="quiz" value={options} onChange={setOptions} allowPages={false} />

        {generate.isError && <p className="text-xs text-error font-medium">{getErrorMessage(generate.error)}</p>}

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-outline-variant/20">
          {quizzes.length > 1 ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-label font-bold uppercase text-on-surface-variant">Active:</span>
              <select
                aria-label="Quiz"
                value={active?._id || ''}
                onChange={(e) => setPickedId(e.target.value)}
                className="bg-surface-container-low border border-outline-variant/40 text-on-surface px-3 py-2 rounded-xl text-xs font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {quizzes.map((q, i) => (
                  <option key={q._id} value={q._id}>
                    {`Quiz ${quizzes.length - i} · ${q.totalQuestions} Qs · ${q.scope || 'All documents'}`}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div />
          )}

          <button
            onClick={() =>
              generate.mutate(toRequestBody(options, 'quiz'), {
                onSuccess: (d) => setPickedId(d.quiz._id),
              })
            }
            disabled={generate.isPending || !ready}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label text-xs font-bold shadow-md hover:shadow-lg transition-all duration-150 transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            type="button"
          >
            {generate.isPending ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                <span>Generating Collection Quiz...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                <span>Generate Cross-Document Quiz</span>
              </>
            )}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12 text-on-surface-variant">
          <span className="material-symbols-outlined text-3xl text-primary animate-spin">progress_activity</span>
        </div>
      ) : active ? (
        <QuizEngine key={active._id} quiz={active} />
      ) : null}
    </div>
  );
};

const CollectionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: collection, isLoading, isError } = useCollection(id);
  const [tab, setTab] = useState('chat');

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-on-surface-variant">
        <span className="material-symbols-outlined text-4xl text-primary animate-spin mb-3">progress_activity</span>
        <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant">Loading Collection...</p>
      </div>
    );
  }

  if (isError || !collection) {
    return (
      <div className="text-center py-16 text-on-surface-variant bg-surface-container-lowest border border-outline-variant/30 rounded-3xl max-w-lg mx-auto">
        <span className="material-symbols-outlined text-4xl text-outline mb-2">folder_off</span>
        <h2 className="font-headline text-2xl font-bold text-on-surface mb-2">Collection Not Found</h2>
        <p className="text-sm text-on-surface-variant mb-4">This collection workspace may have been moved or removed.</p>
        <Link
          to="/documents"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-label font-bold"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back to Library</span>
        </Link>
      </div>
    );
  }

  const readyCount = collection.documents.filter((d) => d.status === 'ready').length;
  const openCitation = (page, citation) =>
    citation?.document && navigate(`/documents/${citation.document}?page=${page}`);

  return (
    <div className="py-6 space-y-6 max-w-5xl mx-auto">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-label uppercase tracking-wider text-on-surface-variant">
        <Link to="/documents" className="hover:text-primary transition-colors flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Document Library</span>
        </Link>
        <span className="text-outline/60">/</span>
        <span className="font-bold text-primary">{collection.name}</span>
      </div>

      {/* High Impact Hero Bento Banner */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 md:p-8 shadow-[0_2px_16px_rgba(58,48,42,0.04)] relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2">
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">folder</span>
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-label font-bold uppercase tracking-widest text-primary">
                  Collection
                </span>
                <span className="text-xs text-outline">•</span>
                <span className="text-xs font-label text-on-surface-variant">
                  {collection.documents.length} {collection.documents.length === 1 ? 'Document' : 'Documents'}
                </span>
              </div>
              <h1 className="font-headline text-2xl md:text-3xl font-bold text-on-surface mt-0.5">
                {collection.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs font-label font-semibold text-on-surface flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span>{readyCount} Ready</span>
            </span>
          </div>
        </div>

        <p className="font-body text-sm text-on-surface-variant mt-2 max-w-2xl">
          Multi-document study workspace. Chat across all documents simultaneously or generate practice quizzes.
        </p>

        {/* Linked Documents Pills */}
        <div className="mt-5 pt-4 border-t border-outline-variant/20">
          <span className="text-xs font-label font-bold uppercase tracking-wider text-on-surface-variant block mb-2.5">
            Documents in Collection:
          </span>
          {collection.documents.length === 0 ? (
            <p className="text-xs text-on-surface-variant italic">
              No documents linked yet. Tag documents with this collection in the Document Library.
            </p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {collection.documents.map((d) => (
                <li key={d._id}>
                  <Link
                    to={`/documents/${d._id}`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/30 text-xs font-medium text-on-surface transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px] text-primary">description</span>
                    <span>{d.title}</span>
                    <DocumentStatus document={d} compact />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Tab Controls */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 w-fit" role="tablist">
        <button
          role="tab"
          aria-selected={tab === 'chat'}
          onClick={() => setTab('chat')}
          className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-label font-bold transition-all cursor-pointer ${
            tab === 'chat'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">forum</span>
          <span>AI Assistant</span>
        </button>

        <button
          role="tab"
          aria-selected={tab === 'quiz'}
          onClick={() => setTab('quiz')}
          className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-label font-bold transition-all cursor-pointer ${
            tab === 'quiz'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">bolt</span>
          <span>Quizzes</span>
        </button>
      </div>

      {/* Tab Panels */}
      {tab === 'chat' ? (
        <div className="h-[72vh] min-h-[500px]">
          <ChatInterface
            collectionId={id}
            documentTitle={collection.name}
            ready={readyCount > 0}
            onCitation={openCitation}
          />
        </div>
      ) : (
        <CollectionQuizzes collectionId={id} ready={readyCount > 0} />
      )}
    </div>
  );
};

export default CollectionDetail;
