import React, { useState } from 'react';
import QuizEngine from '../components/QuizEngine';
import { Loader2, Zap } from 'lucide-react';
import { useDocuments, useQuizzes, useGenerateQuiz } from '../api/hooks';
import { getErrorMessage } from '../lib/api';

const Quizzes = () => {
  const { data: documents = [], isLoading: loadingDocs } = useDocuments();
  const [pickedDocId, setPickedDocId] = useState('');
  const selectedDocId = pickedDocId || documents[0]?._id || '';
  const setSelectedDocId = (id) => { setPickedDocId(id); setPickedQuizId(''); };

  const [quizCount, setQuizCount] = useState(5);
  const [pickedQuizId, setPickedQuizId] = useState('');
  const { data: quizzes = [], isLoading: loadingQuiz } = useQuizzes(selectedDocId);
  const activeQuiz = quizzes.find(q => q._id === pickedQuizId) || quizzes[0] || null;

  const generate = useGenerateQuiz(selectedDocId);
  const generating = generate.isPending;
  const error = generate.error ? getErrorMessage(generate.error, 'Error generating quiz') : '';

  const generateQuiz = () => {
    if (!selectedDocId) return;
    generate.mutate({ count: quizCount }, { onSuccess: (data) => setPickedQuizId(data.quiz._id) });
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
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Select a Document</label>
              <select
                value={selectedDocId}
                onChange={(e) => setSelectedDocId(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
              >
                {documents.map(doc => (
                  <option key={doc._id} value={doc._id}>{doc.title}</option>
                ))}
              </select>
            </div>
            <div className="w-full sm:w-32">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Count</label>
              <select
                value={quizCount}
                onChange={(e) => setQuizCount(Number(e.target.value))}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium cursor-pointer"
              >
                <option value={5}>5 Qs</option>
                <option value={10}>10 Qs</option>
                <option value={15}>15 Qs</option>
              </select>
            </div>

            <div className="flex items-end w-full sm:w-auto mt-4 sm:mt-0">
              <button
                onClick={generateQuiz}
                disabled={generating || loadingQuiz}
                className="h-[50px] w-full px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
                  {`Quiz ${quizzes.length - i} · ${q.totalQuestions} Qs · ${new Date(q.createdAt).toLocaleDateString()}${q.attemptsCount ? ` · best ${q.bestScore}/${q.totalQuestions}` : ' · not attempted'}`}
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
