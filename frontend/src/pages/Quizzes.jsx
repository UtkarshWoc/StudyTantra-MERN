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
        <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant">Accessing Curriculum Decks...</p>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-8 max-w-5xl mx-auto">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-primary-fixed text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">bolt</span>
            </span>
            <span className="text-[11px] font-label font-bold uppercase tracking-widest text-primary">
              Metacognitive Testing Hub
            </span>
          </div>
          <h1 className="font-headline text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
            Interactive Quiz Engine
          </h1>
          <p className="font-body text-sm text-on-surface-variant mt-1 max-w-2xl">
            Evaluate retention, uncover cognitive blindspots, and reinforce syllabus mastery through step-by-step rationales.
          </p>
        </div>

        {activeQuiz && (
          <div className="flex items-center gap-2 text-xs font-label text-on-surface-variant bg-surface-container-low px-3 py-2 rounded-xl border border-outline-variant/30">
            <span className="material-symbols-outlined text-primary text-[18px]">history_edu</span>
            <span>{quizzes.length} Available {quizzes.length === 1 ? 'Exam' : 'Exams'}</span>
          </div>
        )}
      </div>

      {/* Configuration & Generation Bento Card */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 md:p-8 shadow-[0_2px_16px_rgba(58,48,42,0.04)]">
        {documents.length === 0 ? (
          <div className="text-center py-8">
            <span className="material-symbols-outlined text-4xl text-outline mb-2">upload_file</span>
            <p className="text-sm text-on-surface-variant">
              Please upload a textbook or lecture notes in Document Library first to synthesize quizzes.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="quiz-doc" className="block text-xs font-label font-bold uppercase tracking-wider text-on-surface">
                  Source Document
                </label>
                <DocumentStatus document={selectedDoc} />
              </div>
              <select
                id="quiz-doc"
                value={selectedDocId}
                onChange={(e) => setSelectedDocId(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/40 text-on-surface p-3.5 rounded-xl font-body text-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all"
              >
                {documents.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    {doc.title}
                  </option>
                ))}
              </select>
            </div>

            {weakTopics.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-tertiary-fixed/30 border border-tertiary/20 animate-fade-in">
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-xl bg-tertiary text-on-tertiary flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[18px]">warning</span>
                  </span>
                  <div>
                    <span className="text-[11px] font-label font-bold uppercase tracking-wider text-tertiary">
                      Target Weak Topics
                    </span>
                    <p className="text-xs text-on-surface mt-0.5 font-medium">
                      {weakTopics.slice(0, 5).map((t) => `${t.topic} (${t.accuracy}%)`).join(', ')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={practiceWeakTopics}
                  disabled={generating || !ready}
                  className="px-4 py-2 rounded-xl bg-tertiary text-on-tertiary hover:opacity-95 font-label text-xs font-bold whitespace-nowrap shadow-sm disabled:opacity-40 cursor-pointer transition-opacity"
                  type="button"
                >
                  Quiz Weak Areas
                </button>
              </div>
            )}

            <GenerationOptions kind="quiz" value={options} onChange={setOptions} pageCount={selectedDoc?.pageCount} />

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-outline-variant/20">
              {quizzes.length > 1 ? (
                <div className="flex items-center gap-2 flex-1 max-w-sm">
                  <span className="text-xs font-label font-bold uppercase text-on-surface-variant shrink-0">Selected:</span>
                  <select
                    id="quiz-picker"
                    value={activeQuiz?._id || ''}
                    onChange={(e) => setPickedQuizId(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/40 text-on-surface px-3 py-2 rounded-xl text-xs font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {quizzes.map((q, i) => (
                      <option key={q._id} value={q._id}>
                        {`Quiz ${quizzes.length - i} · ${q.totalQuestions} Qs${q.scope ? ` · ${q.scope}` : ''} · ${new Date(q.createdAt).toLocaleDateString()}${
                          q.attemptsCount ? ` · score ${q.bestScore}/${q.totalQuestions}` : ' · unattempted'
                        }`}
                      </option>
                    ))}
                  </select>
                </div>
              ) : <div />}

              <button
                onClick={generateQuiz}
                disabled={generating || loadingQuiz || !ready}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label text-xs font-bold shadow-md hover:shadow-lg transition-all duration-150 transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                type="button"
              >
                {generating ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                    <span>Synthesizing Exam...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                    <span>Generate New Quiz</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {error && <p className="text-xs text-error font-medium mt-4">{error}</p>}
      </div>

      {/* Quiz Engine Interactive Canvas */}
      <div className="min-h-[400px]">
        {loadingQuiz ? (
          <div className="flex flex-col items-center justify-center py-16 text-on-surface-variant">
            <span className="material-symbols-outlined text-3xl text-primary animate-spin mb-3">progress_activity</span>
            <p className="text-xs font-label uppercase tracking-widest">Retrieving questions...</p>
          </div>
        ) : activeQuiz ? (
          <QuizEngine key={activeQuiz._id} quiz={activeQuiz} />
        ) : selectedDocId && !generating ? (
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-10 text-center mx-auto shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-primary-fixed text-primary mx-auto flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-3xl">psychology</span>
            </div>
            <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">No Quizzes Synthesized Yet</h3>
            <p className="text-sm text-on-surface-variant max-w-md mx-auto mb-6">
              Generate an adaptive AI assessment above to benchmark your syllabus knowledge against active recall standards.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Quizzes;
