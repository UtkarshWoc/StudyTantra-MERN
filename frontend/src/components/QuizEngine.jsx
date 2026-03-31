import React, { useState } from 'react';
import { CheckCircle2, XCircle, ChevronRight, Trophy, RefreshCcw } from 'lucide-react';

const QuizEngine = () => {
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const quizData = [];
  
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

  const handleOptionSelect = (index) => {
    if (!isSubmitted) setSelectedOption(index);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (selectedOption === quizData[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setStarted(true);
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setShowResults(false);
  };

  if (!started) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 text-center shadow-sm border border-gray-100 dark:border-gray-700 max-w-2xl mx-auto flex flex-col items-center transition-colors">
        <div className="bg-indigo-50 dark:bg-indigo-900/40 p-6 rounded-full text-indigo-600 dark:text-indigo-400 mb-6 shadow-inner">
          <Trophy size={48} />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">React & Tailwind Fundamentals</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md text-[15px] leading-relaxed">Test your knowledge with an AI-generated quiz based on your recent documents.</p>
        <div className="flex space-x-12 text-sm font-medium text-gray-600 dark:text-gray-300 mb-8 border-t border-b border-gray-100 dark:border-gray-700 py-5 w-full justify-center">
          <div className="flex flex-col"><span className="text-indigo-600 dark:text-indigo-400 font-bold text-lg mb-1">{quizData.length}</span> Questions</div>
          <div className="flex flex-col"><span className="text-indigo-600 dark:text-indigo-400 font-bold text-lg mb-1">~2</span> Minutes</div>
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

  if (showResults) {
    const percentage = Math.round((score / quizData.length) * 100);
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 text-center shadow-sm border border-gray-100 dark:border-gray-700 max-w-2xl mx-auto animate-in fade-in zoom-in duration-300 transition-colors">
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
        <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">You scored {score} out of {quizData.length} correct.</p>
        <button 
          onClick={handleRestart}
          className="flex items-center justify-center mx-auto bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-bold py-3 px-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer shadow-sm shadow-gray-100 dark:shadow-none"
        >
          <RefreshCcw size={18} className="mr-2" />
          Retake Quiz
        </button>
      </div>
    );
  }

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
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQ.correct;
            
            let btnClasses = "w-full text-left p-4 rounded-xl border-2 transition-all font-medium flex justify-between items-center cursor-pointer ";
            
            if (!isSubmitted) {
              btnClasses += isSelected ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-100 shadow-sm" : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-white dark:hover:bg-gray-800 bg-white dark:bg-gray-800";
            } else {
              if (isCorrect) {
                btnClasses += "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-100 shadow-sm";
              } else if (isSelected && !isCorrect) {
                btnClasses += "border-red-500 bg-red-50 dark:bg-red-900/30 text-red-900 dark:text-red-100 shadow-sm";
              } else {
                btnClasses += "border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800 opacity-60";
              }
            }

            return (
              <button 
                key={idx}
                onClick={() => handleOptionSelect(idx)}
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
            <div className={`flex-1 p-5 rounded-2xl ${selectedOption === currentQ.correct ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50' : 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50'}`}>
              <h4 className={`font-bold mb-2 flex items-center ${selectedOption === currentQ.correct ? 'text-emerald-800 dark:text-emerald-400' : 'text-indigo-900 dark:text-indigo-400'}`}>
                {selectedOption === currentQ.correct ? 'Correct!' : 'Explanation'}
              </h4>
              <p className={`text-sm leading-relaxed ${selectedOption === currentQ.correct ? 'text-emerald-700 dark:text-emerald-300' : 'text-indigo-800 dark:text-indigo-300'}`}>
                {currentQ.explanation}
              </p>
            </div>
            <button 
              onClick={handleNext}
              className="w-full md:w-auto bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-3 px-6 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 hover:shadow-lg transition-all flex items-center justify-center whitespace-nowrap cursor-pointer shadow-md"
            >
              {currentQuestion < quizData.length - 1 ? 'Next Question' : 'View Results'}
              <ChevronRight size={20} className="ml-2" />
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
