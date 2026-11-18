import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import QuizEngine from '../components/QuizEngine';
import GenerationOptions from '../components/GenerationOptions';
import DocumentStatus from '../components/DocumentStatus';
import { useDocuments, useQuizzes, useGenerateQuiz, useTopics } from '../api/hooks';
import { getErrorMessage } from '../lib/api';
import { defaultOptions, toRequestBody } from '../lib/generation';

const Quizzes = () => {
  const { data: documents = [], isLoading: loadingDocs } = useDocuments();
  const [searchParams] = useSearchParams();
  const [pickedDocId, setPickedDocId] = useState(searchParams.get('document') || '');
  const selectedDocId = pickedDocId || documents[0]?._id || '';
  const setSelectedDocId = (id) => {
    setPickedDocId(id);
    setPickedQuizId('');
  };
  const selectedDoc = documents.find((d) => d._id === selectedDocId);
  const ready = selectedDoc?.status === 'ready';

  const [options, setOptions] = useState(() => {
    const topic = searchParams.get('topic');
    return topic ? { ...defaultOptions('quiz'), scope: 'topic', query: topic } : defaultOptions('quiz');
  });
  const { data: topics = [] } = useTopics(selectedDocId || undefined);
  const weakTopics = selectedDocId ? topics.filter((t) => t.weak) : [];
  const [pickedQuizId, setPickedQuizId] = useState('');
  const { data: quizzes = [], isLoading: loadingQuiz } = useQuizzes(selectedDocId);
  const activeQuiz = quizzes.find((q) => q._id === pickedQuizId) || quizzes[0] || null;

  const generate = useGenerateQuiz(selectedDocId);
  const generating = generate.isPending;
  const error = generate.error ? getErrorMessage(generate.error, 'Error generating quiz') : '';

  const practiceWeakTopics = () => {
    const query = weakTopics
      .slice(0, 5)
      .map((t) => t.topic)
      .join(', ');
    const next = { ...options, scope: 'topic', query };
    setOptions(next);
    generate.mutate(toRequestBody(next, 'quiz'), {
      onSuccess: (data) => setPickedQuizId(data.quiz._id),
    });
  };

  const generateQuiz = () => {
    if (!selectedDocId) return;
    generate.mutate(toRequestBody(options, 'quiz'), {
      onSuccess: (data) => setPickedQuizId(data.quiz._id),
    });
  };

  if (loadingDocs) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-on-surface-variant">
        <span className="material-symbols-outlined text-4xl text-primary animate-spin mb-3">progress_activity</span>
        <p className="font-label text-xs uppercase tracking-widest">Loading Documents...</p>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-8 max-w-5xl mx-auto font-body">
      {/* Header */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 md:p-8 shadow-[0_2px_16px_rgba(58,48,42,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
            Quizzes
          </h1>
          <p className="font-body text-xs md:text-sm text-on-surface-variant mt-1">
            Test your knowledge with AI-generated quizzes based on your documents.
          </p>
        </div>

        {activeQuiz && (
          <span className="px-3 py-1.5 rounded-xl bg-surface-container border border-outline-variant/30 text-xs font-label text-on-surface-variant">
            {quizzes.length} {quizzes.length === 1 ? 'Quiz' : 'Quizzes'} Available
          </span>
        )}
      </div>

      {/* Configuration & Generation Bento Card */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 md:p-8 shadow-[0_2px_16px_rgba(58,48,42,0.04)] space-y-6">
        {documents.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-xs text-on-surface-variant">
              Please upload a document in Library first to take quizzes.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="quiz-doc" className="block text-xs font-label font-bold uppercase tracking-wider text-on-surface">
                  Document
                </label>
                <DocumentStatus document={selectedDoc} />
              </div>
              <select
                id="quiz-doc"
                value={selectedDocId}
                onChange={(e) => setSelectedDocId(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/40 text-on-surface p-3 rounded-xl font-body text-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all"
              >
                {documents.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    {doc.title}
                  </option>
                ))}
              </select>
            </div>

            {weakTopics.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-tertiary-fixed/30 border border-tertiary/20">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-tertiary text-[20px] shrink-0">warning</span>
                  <div>
                    <span className="text-xs font-label font-bold uppercase text-tertiary">
                      Weak topics:
                    </span>{' '}
                    <span className="text-xs text-on-surface">
                      {weakTopics.slice(0, 5).map((t) => `${t.topic} (${t.accuracy}%)`).join(', ')}
                    </span>
                  </div>
                </div>
                <button
                  onClick={practiceWeakTopics}
                  disabled={generating || !ready}
                  className="px-4 py-1.5 rounded-xl bg-tertiary text-on-tertiary font-label text-xs font-bold whitespace-nowrap disabled:opacity-40 cursor-pointer shrink-0"
                  type="button"
                >
                  Quiz me on these
                </button>
              </div>
            )}

            <GenerationOptions kind="quiz" value={options} onChange={setOptions} pageCount={selectedDoc?.pageCount} />

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-outline-variant/20">
              {quizzes.length > 1 ? (
                <div className="flex items-center gap-2">
                  <label htmlFor="quiz-picker" className="text-xs font-label font-bold uppercase text-on-surface-variant shrink-0">
                    Quiz:
                  </label>
                  <select
                    id="quiz-picker"
                    value={activeQuiz?._id || ''}
                    onChange={(e) => setPickedQuizId(e.target.value)}
                    className="bg-surface-container-low border border-outline-variant/40 text-on-surface px-3 py-2 rounded-xl text-xs font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {quizzes.map((q, i) => (
                      <option key={q._id} value={q._id}>
                        {`Quiz ${quizzes.length - i} · ${q.totalQuestions} Qs${q.scope ? ` · ${q.scope}` : ''} · ${new Date(q.createdAt).toLocaleDateString()}${
                          q.attemptsCount ? ` · best ${q.bestScore}/${q.totalQuestions}` : ' · not attempted'
                        }`}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div />
              )}

              <button
                onClick={generateQuiz}
                disabled={generating || loadingQuiz || !ready}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label text-xs font-bold shadow-md hover:shadow-lg transition-all duration-150 transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                type="button"
              >
                {generating ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                    <span>Generating Quiz...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">bolt</span>
                    <span>Generate New Quiz</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {error && <p className="text-xs text-error font-medium mt-2">{error}</p>}
      </div>

      {/* Quiz Engine Interactive Canvas */}
      <div className="min-h-[400px]">
        {loadingQuiz ? (
          <div className="flex flex-col items-center justify-center py-16 text-on-surface-variant">
            <span className="material-symbols-outlined text-3xl text-primary animate-spin mb-3">progress_activity</span>
            <p className="text-xs font-label uppercase tracking-widest">Loading quiz...</p>
          </div>
        ) : activeQuiz ? (
          <QuizEngine key={activeQuiz._id} quiz={activeQuiz} />
        ) : selectedDocId && !generating ? (
          <div className="text-center py-16 bg-surface-container-lowest border border-dashed border-outline-variant/40 rounded-3xl p-8">
            <div className="w-16 h-16 rounded-2xl bg-primary-fixed text-primary mx-auto flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-3xl">bolt</span>
            </div>
            <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">No Quiz Found for This Document</h3>
            <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
              Click "Generate New Quiz" above to create an AI quiz based on your document.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Quizzes;
