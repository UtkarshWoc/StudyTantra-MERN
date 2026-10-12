import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import QuizEngine from '../components/QuizEngine';
import { Loader2, Zap, AlertTriangle } from 'lucide-react';
import GenerationOptions from '../components/GenerationOptions';
import DocumentStatus from '../components/DocumentStatus';
import { useDocuments, useQuizzes, useGenerateQuiz, useTopics } from '../api/hooks';
import { getErrorMessage } from '../lib/api';
import { defaultOptions, toRequestBody } from '../lib/generation';

const Quizzes = () => {
  const { data: documents = [], isLoading: loadingDocs } = useDocuments();
  // ?document=&topic= (from dashboard weak topics and study-plan tasks)
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
      <div className="flex flex-col flex-1 h-96 items-center justify-center text-gray-400">
        <Loader2 className="animate-spin mb-3" size={40} />
        <p>Loading your documents...</p>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6 max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Quiz Center</h2>
        {documents.length === 0 ? (
          <p className="text-gray-500">Please upload a document in Your Library first to take quizzes.</p>
        ) : (
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="quiz-doc" className="block text-sm font-bold text-gray-700 dark:text-gray-300">Document</label>
                <DocumentStatus document={selectedDoc} />
              </div>
              <select
                id="quiz-doc"
                value={selectedDocId}
                onChange={(e) => setSelectedDocId(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 p-3 rounded-xl font-medium cursor-pointer"
              >
                {documents.map(doc => (
                  <option key={doc._id} value={doc._id}>{doc.title}</option>
                ))}
              </select>
            </div>

            {weakTopics.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <AlertTriangle size={18} className="text-amber-500 shrink-0" />
                <p className="flex-1 text-sm text-gray-700 dark:text-gray-200">
                  <span className="font-semibold">Weak topics:</span> {weakTopics.slice(0, 5).map((t) => `${t.topic} (${t.accuracy}%)`).join(', ')}
                </p>
                <button onClick={practiceWeakTopics} disabled={generating || !ready} className="text-sm font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap disabled:opacity-50 cursor-pointer">Quiz me on these</button>
              </div>
            )}

            <GenerationOptions kind="quiz" value={options} onChange={setOptions} pageCount={selectedDoc?.pageCount} />

            <div className="flex justify-end">
              <button
                onClick={generateQuiz}
                disabled={generating || loadingQuiz || !ready}
                className="h-12 px-6 bg-amber-500 hover:bg-amber-600 text-[#0b1120] font-bold rounded-xl shadow-md transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {generating ? <><Loader2 className="animate-spin mr-2" size={18} /> Generating AI Quiz...</> : <><Zap size={18} className="mr-2" /> Generate New Quiz</>}
              </button>
            </div>
          </div>
        )}
        {error && <p className="text-red-500 text-sm mt-3 font-medium">{error}</p>}
        {quizzes.length > 1 && (
          <div className="mt-4">
            <label htmlFor="quiz-picker" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Quiz</label>
            <select
              id="quiz-picker"
              value={activeQuiz?._id || ''}
              onChange={(e) => setPickedQuizId(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 p-3 rounded-xl font-medium cursor-pointer"
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
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <Loader2 className="animate-spin mb-3" size={32} />
            <p>Loading quiz data...</p>
          </div>
        ) : activeQuiz ? (
          <QuizEngine key={activeQuiz._id} quiz={activeQuiz} />
        ) : selectedDocId && !generating ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 text-center shadow-sm border border-gray-100 dark:border-gray-700 mx-auto flex flex-col items-center">
            <div className="bg-indigo-50 dark:bg-indigo-900 p-6 rounded-full text-indigo-400 mb-6">
              <Zap size={48} />
            </div>
            <h3 className="text-2xl font-bold mb-2 dark:text-white">No quiz found for this document</h3>
            <p className="text-gray-500 mb-6">Click the "Generate New Quiz" button above to use AI to automatically create a quiz based on your document's contents.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Quizzes;
