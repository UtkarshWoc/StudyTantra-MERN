import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, ChevronRight, Trophy, RefreshCcw, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const QuizEngine = ({ quiz }) => {
  const { user } = useAuth();
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false); // Current question submitted

  // Array of user answers (the string they selected)
  const [userAnswers, setUserAnswers] = useState([]);

  const [score, setScore] = useState(quiz?.score || 0);
  const [showResults, setShowResults] = useState(quiz?.attempted || false);
  const [submittingToServer, setSubmittingToServer] = useState(false);

  const quizData = quiz?.questions || [];

  // Reset engine when quiz changes
  useEffect(() => {
    setStarted(false);
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setUserAnswers([]);
    setScore(quiz?.score || 0);
    setShowResults(quiz?.attempted || false);
  }, [quiz]);

  if (quizData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 text-center shadow-sm border border-gray-100 dark:border-gray-700 max-w-2xl mx-auto flex flex-col items-center min-h-[300px] justify-center transition-colors">
        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-full text-gray-400 dark:text-gray-500 mb-6 shadow-inner">
          <Trophy size={48} />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">No quizzes available</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md text-[15px] leading-relaxed">Upload documents to generate quizzes automatically and test your knowledge.</p>
      </div>
    );
  }

  const handleOptionSelect = (option) => {
    if (!isSubmitted) setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption) return;

    setIsSubmitted(true);

    // Save their answer
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = selectedOption;
    setUserAnswers(newAnswers);

    // AI returns 'correctAnswer' as string. So check equality.
    if (selectedOption === quizData[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = async () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      // Quiz finished, submit to backend
      setSubmittingToServer(true);
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/quizzes/${quiz._id}/submit`,
          { answers: userAnswers },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
      } catch (err) {
        console.error("Failed to save quiz results", err);
      } finally {
        setSubmittingToServer(false);
        setShowResults(true);
      }
    }
  };

  // --- START SCREEN ---
  if (!started && !showResults) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 text-center shadow-sm border border-gray-100 dark:border-gray-700 max-w-2xl mx-auto flex flex-col items-center transition-colors">
        <div className="bg-indigo-50 dark:bg-indigo-900/40 p-6 rounded-full text-indigo-600 dark:text-indigo-400 mb-6 shadow-inner">
          <Trophy size={48} />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">AI Generated Quiz</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md text-[15px] leading-relaxed">Test your knowledge with an AI-generated quiz based on your document's concepts.</p>
        <div className="flex space-x-12 text-sm font-medium text-gray-600 dark:text-gray-300 mb-8 border-t border-b border-gray-100 dark:border-gray-700 py-5 w-full justify-center">
          <div className="flex flex-col"><span className="text-indigo-600 dark:text-indigo-400 font-bold text-lg mb-1">{quizData.length}</span> Questions</div>
          <div className="flex flex-col"><span className="text-indigo-600 dark:text-indigo-400 font-bold text-lg mb-1">~{Math.ceil(quizData.length * 0.5)}</span> Minutes</div>
        </div>
        <button
          onClick={() => setStarted(true)}
          className="bg-indigo-600 text-white font-bold py-3.5 px-8 rounded-xl shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all w-full md:w-2/3 cursor-pointer"
        >
          Start Quiz
        </button>
      </div>
    );
  }

  // --- REVIEW/RESULTS SCREEN ---
  if (showResults) {
    const total = quiz?.totalQuestions || quizData.length;
    const percentage = Math.round((score / total) * 100);

    return (
      <div className="space-y-8 animate-in fade-in zoom-in duration-300 transition-colors">
        {/* Results Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 text-center shadow-sm border border-gray-100 dark:border-gray-700 max-w-2xl mx-auto">
          <div className="relative inline-block mb-6">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100 dark:text-gray-700" />
              <circle
                cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent"
                strokeDasharray="377"
                strokeDashoffset={377 - (377 * percentage) / 100}
                className={`transition-all duration-1000 ease-out ${percentage >= 70 ? 'text-emerald-500 dark:text-emerald-400' : 'text-yellow-500 dark:text-yellow-400'}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">{percentage}%</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {percentage >= 70 ? 'Great job!' : 'Keep practicing!'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">You scored {score} out of {total} correct.</p>
        </div>

        {/* Answer Review List */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-10 max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">Quiz Review</h3>

          <div className="space-y-8">
            {quizData.map((q, idx) => {
              const userAnswer = userAnswers[idx];
              const isCorrect = userAnswer === q.correctAnswer;
              // If userAnswers is empty (because they are just viewing a past quiz), we don't have their specific answers.
              // So we just show the correct answer and explanation.
              const hasUserAnswers = userAnswers.length > 0;

              return (
                <div key={idx} className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-4">{idx + 1}. {q.question}</h4>

                  <div className="space-y-2 mb-4 text-sm font-medium">
                    {q.options.map((opt, optIdx) => {
                      const isCorrectOpt = opt === q.correctAnswer;
                      const isUserPicked = userAnswer === opt;

                      let classes = "p-3 rounded-lg border ";
                      if (isCorrectOpt) {
                        classes += "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 text-emerald-800 dark:text-emerald-200";
                      } else if (hasUserAnswers && isUserPicked) {
                        classes += "bg-red-50 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-200";
                      } else {
                        classes += "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400";
                      }

                      return (
                        <div key={optIdx} className={`flex items-center justify-between ${classes}`}>
                          <span>{opt}</span>
                          {isCorrectOpt && <CheckCircle2 size={18} className="text-emerald-500 dark:text-emerald-400" />}
                          {hasUserAnswers && isUserPicked && !isCorrectOpt && <XCircle size={18} className="text-red-500 dark:text-red-400" />}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800/30 text-sm">
                    <span className="font-bold text-indigo-800 dark:text-indigo-300 block mb-1">Explanation:</span>
                    <span className="text-indigo-700 dark:text-indigo-200 leading-relaxed">{q.explanation}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // --- ACTIVE QUIZ VIEW ---
  const currentQ = quizData[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto w-full">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
          <span className="bg-white dark:bg-gray-800 px-3 py-1 rounded-md border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">Question {currentQuestion + 1} of {quizData.length}</span>
          <span className="bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 font-bold px-3 py-1 rounded-md transition-colors">Score: {score}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 shadow-inner transition-colors">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentQuestion) / quizData.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="p-8 md:p-10 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-snug">
            {currentQ.question}
          </h3>
        </div>

        <div className="p-6 md:p-8 space-y-3 bg-gray-50/30 dark:bg-gray-900/30">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedOption === option;
            const isCorrect = option === currentQ.correctAnswer;

            let btnClasses = "w-full text-left p-4 rounded-xl border-2 transition-all font-medium flex justify-between items-center cursor-pointer ";

            if (!isSubmitted) {
              btnClasses += isSelected ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-100 shadow-sm" : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-white dark:hover:bg-gray-800 bg-white dark:bg-gray-800";
            } else {
              if (isCorrect) {
                // The option is correct
                btnClasses += "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-100 shadow-sm";
              } else if (isSelected && !isCorrect) {
                // User picked it, but it's wrong
                btnClasses += "border-red-500 bg-red-50 dark:bg-red-900/30 text-red-900 dark:text-red-100 shadow-sm";
              } else {
                // Unselected wrong option
                btnClasses += "border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800 opacity-60";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(option)}
                disabled={isSubmitted}
                className={btnClasses}
              >
                <span className="text-[15px]">{option}</span>
                {isSubmitted && isCorrect && <CheckCircle2 size={22} className="text-emerald-500 dark:text-emerald-400 flex-shrink-0" />}
                {isSubmitted && isSelected && !isCorrect && <XCircle size={22} className="text-red-500 dark:text-red-400 flex-shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Action Area & Explanation */}
        {isSubmitted && (
          <div className="p-6 md:p-8 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 animate-in slide-in-from-bottom-2 duration-300 flex flex-col md:flex-row items-start justify-between gap-6">
            <div className={`flex-1 p-5 rounded-2xl ${selectedOption === currentQ.correctAnswer ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50' : 'bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50'}`}>
              <h4 className={`font-bold mb-2 flex items-center ${selectedOption === currentQ.correctAnswer ? 'text-emerald-800 dark:text-emerald-400' : 'text-red-800 dark:text-red-400'}`}>
                {selectedOption === currentQ.correctAnswer ? 'Correct!' : 'Incorrect'}
              </h4>
              <p className={`text-sm leading-relaxed ${selectedOption === currentQ.correctAnswer ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}>
                {currentQ.explanation}
              </p>
            </div>
            <button
              onClick={handleNext}
              disabled={submittingToServer}
              className="w-full md:w-auto bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-3 px-6 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 hover:shadow-lg transition-all flex items-center justify-center whitespace-nowrap cursor-pointer shadow-md disabled:opacity-50"
            >
              {submittingToServer ? <Loader2 className="animate-spin w-5 h-5" /> : currentQuestion < quizData.length - 1 ? 'Next Question' : 'View Results'}
              {!submittingToServer && <ChevronRight size={20} className="ml-2" />}
            </button>
          </div>
        )}

        {!isSubmitted && (
          <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className="w-full md:w-auto bg-indigo-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-indigo-700 hover:shadow-lg transition-all shadow-md disabled:opacity-50 disabled:hover:shadow-md disabled:cursor-not-allowed cursor-pointer"
            >
              Submit Answer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizEngine;
