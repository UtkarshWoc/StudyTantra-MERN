import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import QuizEngine from '../components/QuizEngine';
import { Loader2, Zap, AlertTriangle, Target } from 'lucide-react';
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
  const setSelectedDocId = (id) => { setPickedDocId(id); setPickedQuizId(''); };
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
  const activeQuiz = quizzes.find(q => q._id === pickedQuizId) || quizzes[0] || null;

  const generate = useGenerateQuiz(selectedDocId);
  const generating = generate.isPending;
  const error = generate.error ? getErrorMessage(generate.error, 'Error generating quiz') : '';

  const practiceWeakTopics = () => {
    const query = weakTopics.slice(0, 5).map((t) => t.topic).join(', ');
    const next = { ...options, scope: 'topic', query };
    setOptions(next);
    generate.mutate(toRequestBody(next, 'quiz'), { onSuccess: (data) => setPickedQuizId(data.quiz._id) });
  };

  const generateQuiz = () => {
    if (!selectedDocId) return;
    generate.mutate(toRequestBody(options, 'quiz'), { onSuccess: (data) => setPickedQuizId(data.quiz._id) });
  };

  if (loadingDocs) {
    return (
      <div className="flex flex-col flex-1 h-96 items-center justify-center text-slate-500">
        <Loader2 className="animate-spin mb-3" size={40} />
        <p>Loading your documents...</p>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6 max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-4">
        <div className="inline-flex items-center justify-center p-4 bg-amber-500/10 rounded-2xl text-amber-400 mb-5 shadow-lg shadow-amber-500/10">
          <Target size={36} />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">Quiz Center</h1>
        <p className="text-slate-400 max-w-lg mx-auto">Test your knowledge with AI-generated quizzes based on your documents.</p>
      </div>

      <div className="glass-card p-6 rounded-2xl">
        {documents.length === 0 ? (
          <p className="text-slate-400">Please upload a document in Your Library first to take quizzes.</p>
        ) : (
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="quiz-doc" className="block text-sm font-bold text-slate-300">Document</label>
                <DocumentStatus document={selectedDoc} />
              </div>
              <select
                id="quiz-doc"
                value={selectedDocId}
                onChange={(e) => setSelectedDocId(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] text-slate-200 p-3 rounded-xl font-medium cursor-pointer focus:outline-none focus:border-amber-500/40 transition-all"
              >
                {documents.map(doc => <option key={doc._id} value={doc._id}>{doc.title}</option>)}
              </select>
            </div>

            {weakTopics.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl bg-amber-500/[0.06] border border-amber-500/20 animate-slide-up">
                <AlertTriangle size={18} className="text-amber-400 shrink-0" />
                <p className="flex-1 text-sm text-slate-300">
                  <span className="font-semibold text-amber-300">Weak topics:</span> {weakTopics.slice(0, 5).map((t) => `${t.topic} (${t.accuracy}%)`).join(', ')}
                </p>
                <button onClick={practiceWeakTopics} disabled={generating || !ready} className="text-sm font-bold text-amber-400 whitespace-nowrap disabled:opacity-50 cursor-pointer hover:text-amber-300 transition-colors">Quiz me on these</button>
              </div>
            )}

            <GenerationOptions kind="quiz" value={options} onChange={setOptions} pageCount={selectedDoc?.pageCount} />

            <div className="flex justify-end">
              <button
                onClick={generateQuiz}
                disabled={generating || loadingQuiz || !ready}
                className="h-12 px-6 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-[#0b1120] font-bold rounded-xl shadow-lg shadow-amber-900/20 btn-press flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {generating ? <><Loader2 className="animate-spin mr-2" size={18} /> Generating AI Quiz...</> : <><Zap size={18} className="mr-2" /> Generate New Quiz</>}
              </button>
            </div>
          </div>
        )}
        {error && <p className="text-red-400 text-sm mt-3 font-medium animate-scale-in">{error}</p>}
        {quizzes.length > 1 && (
          <div className="mt-4">
            <label htmlFor="quiz-picker" className="block text-sm font-bold text-slate-300 mb-2">Quiz</label>
            <select
              id="quiz-picker"
              value={activeQuiz?._id || ''}
              onChange={(e) => setPickedQuizId(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] text-slate-200 p-3 rounded-xl font-medium cursor-pointer focus:outline-none focus:border-amber-500/40 transition-all"
            >
              {quizzes.map((q, i) => (
                <option key={q._id} value={q._id}>
                  {`Quiz ${quizzes.length - i} · ${q.totalQuestions} Qs${q.scope ? ` · ${q.scope}` : ''} · ${new Date(q.createdAt).toLocaleDateString()}${q.attemptsCount ? ` · best ${q.bestScore}/${q.totalQuestions}` : ' · not attempted'}`}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="min-h-[400px]">
        {loadingQuiz ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <Loader2 className="animate-spin mb-3" size={32} />
            <p>Loading quiz data...</p>
          </div>
        ) : activeQuiz ? (
          <QuizEngine key={activeQuiz._id} quiz={activeQuiz} />
        ) : selectedDocId && !generating ? (
          <div className="glass-card rounded-2xl p-10 text-center mx-auto flex flex-col items-center animate-slide-up">
            <div className="bg-amber-500/10 p-6 rounded-full text-amber-400 mb-6">
              <Zap size={48} />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-white">No quiz found for this document</h3>
            <p className="text-slate-400 mb-6">Click "Generate New Quiz" above to create an AI quiz based on your document.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Quizzes;
