import React, { useState } from 'react';
import { CheckCircle2, XCircle, ChevronRight, Trophy, RefreshCcw, Loader2, Printer } from 'lucide-react';
import { checkQuizAnswer, useSubmitQuiz, useQuizAttempts } from '../api/hooks';

const isTextQuestion = (q) => q?.type === 'fill_blank' || q?.type === 'short_answer';

const QuizEngine = ({ quiz }) => {
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [checking, setChecking] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [checks, setChecks] = useState([]);
  const [reviewQuestions, setReviewQuestions] = useState(null);
  const [attemptResults, setAttemptResults] = useState([]);
  const [score, setScore] = useState(quiz?.score || 0);
  const [showResults, setShowResults] = useState(quiz?.attempted || false);
  const [submittingToServer, setSubmittingToServer] = useState(false);
  const [error, setError] = useState('');

  const quizData = quiz?.questions || [];
  const submitQuiz = useSubmitQuiz(quiz?.document);
  const { data: attemptsData } = useQuizAttempts(quiz?._id, Boolean(quiz?.attempted));

  const [syncedAttemptsData, setSyncedAttemptsData] = useState(null);
  if (attemptsData && attemptsData !== syncedAttemptsData && !started) {
    setSyncedAttemptsData(attemptsData);
    setReviewQuestions(attemptsData.quiz?.questions || null);
    const latest = attemptsData.attempts?.[0];
    if (latest) {
      setUserAnswers(latest.answers.map(a => a.answer));
      setAttemptResults(latest.answers.map(a => ({ correct: a.correct, feedback: a.feedback })));
      setScore(latest.score);
    }
  }

  if (quizData.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-10 text-center max-w-2xl mx-auto flex flex-col items-center min-h-[300px] justify-center">
        <div className="bg-white/[0.04] p-6 rounded-full text-slate-500 mb-6">
          <Trophy size={48} />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">No quizzes available</h2>
        <p className="text-slate-400 max-w-md text-[15px] leading-relaxed">Upload documents to generate quizzes and test your knowledge.</p>
      </div>
    );
  }

  const handleOptionSelect = (option) => { if (!isSubmitted) setSelectedOption(option); };

  const handleSubmit = async () => {
    if (!selectedOption?.trim() || checking) return;
    setChecking(true);
    setError('');
    try {
      const data = await checkQuizAnswer(quiz._id, currentQuestion, selectedOption.trim());
      const newAnswers = [...userAnswers];
      newAnswers[currentQuestion] = selectedOption.trim();
      setUserAnswers(newAnswers);
      const newChecks = [...checks];
      newChecks[currentQuestion] = data;
      setChecks(newChecks);
      if (data.correct) setScore(prev => prev + 1);
      setIsSubmitted(true);
    } catch {
      setError('Could not check your answer. Please try again.');
    } finally {
      setChecking(false);
    }
  };

  const handleRetake = () => {
    setStarted(true); setShowResults(false); setCurrentQuestion(0);
    setSelectedOption(null); setIsSubmitted(false); setUserAnswers([]);
    setChecks([]); setAttemptResults([]); setScore(0); setError('');
  };

  const handleNext = async () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setSubmittingToServer(true);
      try {
        const data = await submitQuiz.mutateAsync({ quizId: quiz._id, answers: userAnswers });
        setScore(data.score);
        setReviewQuestions(data.quiz?.questions || null);
        setAttemptResults((data.attempt?.answers || []).map(a => ({ correct: a.correct, feedback: a.feedback })));
      } catch (err) {
        console.error("Failed to save quiz results", err);
        setError('Your results could not be saved.');
      } finally {
        setSubmittingToServer(false);
        setShowResults(true);
      }
    }
  };

  // --- START SCREEN ---
  if (!started && !showResults) {
    return (
      <div className="glass-card gradient-border rounded-2xl p-10 text-center max-w-2xl mx-auto flex flex-col items-center animate-scale-in">
        <div className="bg-amber-500/10 p-6 rounded-full text-amber-400 mb-6 shadow-lg shadow-amber-500/10">
          <Trophy size={48} />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">AI Generated Quiz</h2>
        <p className="text-slate-400 mb-8 max-w-md text-[15px] leading-relaxed">Test your knowledge with AI-generated questions based on your document.</p>
        <div className="flex space-x-12 text-sm font-medium text-slate-300 mb-8 border-t border-b border-white/[0.06] py-5 w-full justify-center">
          <div className="flex flex-col"><span className="text-amber-400 font-bold text-lg mb-1">{quizData.length}</span> Questions</div>
          <div className="flex flex-col"><span className="text-amber-400 font-bold text-lg mb-1">~{Math.ceil(quizData.length * 0.5)}</span> Minutes</div>
        </div>
        <button
          onClick={() => setStarted(true)}
          className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-[#0b1120] font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-amber-900/20 hover:shadow-amber-500/20 w-full md:w-2/3 btn-press cursor-pointer"
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
      <div className="space-y-8 animate-scale-in">
        <div className="glass-card gradient-border rounded-2xl p-10 text-center max-w-2xl mx-auto">
          <div className="relative inline-block mb-6">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/[0.06]" />
              <circle
                cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent"
                strokeDasharray="377"
                strokeDashoffset={377 - (377 * percentage) / 100}
                strokeLinecap="round"
                className={`transition-all duration-1000 ease-out ${percentage >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">{percentage}%</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {percentage >= 70 ? '🎉 Great job!' : 'Keep practicing!'}
          </h2>
          <p className="text-slate-400 mb-8 font-medium">You scored {score} out of {total} correct.</p>
          {error && <p className="text-sm text-red-400 mb-4">{error}</p>}
          <div className="flex justify-center gap-3">
            <button onClick={handleRetake} className="print:hidden inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 text-[#0b1120] font-bold py-3 px-6 rounded-xl shadow-lg shadow-amber-900/20 btn-press cursor-pointer">
              <RefreshCcw size={18} /> Retake Quiz
            </button>
            <button onClick={() => window.print()} className="print:hidden inline-flex items-center gap-2 py-3 px-5 rounded-xl glass-card font-semibold text-slate-300 hover:text-amber-300 hover:border-amber-500/30 transition-all cursor-pointer">
              <Printer size={18} /> Print / Save PDF
            </button>
          </div>
        </div>

        {/* Answer Review List */}
        <div className="glass-card rounded-2xl p-6 md:p-10 max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-white mb-6 border-b border-white/[0.06] pb-4">Quiz Review</h3>
          <div className="space-y-6 stagger-children">
            {!reviewQuestions && <p className="text-sm text-slate-400">Loading answers...</p>}
            {(reviewQuestions || []).map((q, idx) => {
              const userAnswer = userAnswers[idx];
              const hasUserAnswers = userAnswers.length > 0;

              return (
                <div key={idx} className="bg-white/[0.03] rounded-xl p-6 border border-white/[0.06]">
                  <h4 className="font-bold text-white mb-4">{idx + 1}. {q.question}</h4>

                  {isTextQuestion(q) ? (
                    <div className="space-y-2 mb-4 text-sm">
                      {hasUserAnswers && (
                        <div className={`p-3 rounded-lg border ${attemptResults[idx]?.correct ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border-red-500/30 text-red-300'}`}>
                          <span className="font-semibold">Your answer: </span>{userAnswer || <em>No answer</em>}
                          {attemptResults[idx]?.feedback && <p className="mt-1 text-xs opacity-80">{attemptResults[idx].feedback}</p>}
                        </div>
                      )}
                      <div className="p-3 rounded-lg border bg-white/[0.04] border-white/[0.08] text-slate-300">
                        <span className="font-semibold">Model answer: </span>{q.correctAnswer}
                      </div>
                    </div>
                  ) : (
                  <div className="space-y-2 mb-4 text-sm font-medium">
                    {q.options.map((opt, optIdx) => {
                      const isCorrectOpt = opt === q.correctAnswer;
                      const isUserPicked = userAnswer === opt;
                      let classes = "p-3 rounded-lg border ";
                      if (isCorrectOpt) classes += "bg-emerald-500/10 border-emerald-500/30 text-emerald-300";
                      else if (hasUserAnswers && isUserPicked) classes += "bg-red-500/10 border-red-500/30 text-red-300";
                      else classes += "bg-white/[0.02] border-white/[0.06] text-slate-500";

                      return (
                        <div key={optIdx} className={`flex items-center justify-between ${classes}`}>
                          <span>{opt}</span>
                          {isCorrectOpt && <CheckCircle2 size={18} className="text-emerald-400" />}
                          {hasUserAnswers && isUserPicked && !isCorrectOpt && <XCircle size={18} className="text-red-400" />}
                        </div>
                      );
                    })}
                  </div>
                  )}

                  <div className="mt-4 p-4 bg-amber-500/[0.06] rounded-lg border border-amber-500/15 text-sm">
                    <span className="font-bold text-amber-400 block mb-1">Explanation:</span>
                    <span className="text-amber-200/80 leading-relaxed">{q.explanation}</span>
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
  const currentCheck = checks[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto w-full animate-fade-in">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm font-semibold text-slate-400 mb-3">
          <span className="glass-card px-3 py-1 rounded-md">Question {currentQuestion + 1} of {quizData.length}</span>
          <span className="bg-amber-500/10 text-amber-400 font-bold px-3 py-1 rounded-md border border-amber-500/20">Score: {score}</span>
        </div>
        <div className="w-full bg-white/[0.06] rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-500 to-amber-400 h-2 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(245,158,11,0.3)]"
            style={{ width: `${((currentQuestion) / quizData.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-8 md:p-10 border-b border-white/[0.06]">
          <h3 className="text-xl md:text-2xl font-bold text-white leading-snug">{currentQ.question}</h3>
        </div>

        <div className="p-6 md:p-8 space-y-3 bg-white/[0.02]">
          {isTextQuestion(currentQ) && (
            <textarea
              aria-label="Your answer"
              value={selectedOption ?? ''}
              onChange={(e) => !isSubmitted && setSelectedOption(e.target.value)}
              readOnly={isSubmitted}
              maxLength={1000}
              rows={currentQ.type === 'short_answer' ? 4 : 1}
              placeholder={currentQ.type === 'short_answer' ? 'Write your answer in a sentence or two...' : 'Type the missing word(s)...'}
              className="w-full p-4 rounded-xl border-2 border-white/[0.08] bg-white/[0.04] text-slate-100 focus:outline-none focus:border-amber-500/40 resize-none placeholder-slate-500 transition-all duration-300"
            />
          )}
          {!isTextQuestion(currentQ) && currentQ.options.map((option, idx) => {
            const isSelected = selectedOption === option;
            const isCorrect = option === currentCheck?.correctAnswer;

            let btnClasses = "w-full text-left p-4 rounded-xl border-2 transition-all duration-300 font-medium flex justify-between items-center cursor-pointer ";
            if (!isSubmitted) {
              btnClasses += isSelected ? "border-amber-500/50 bg-amber-500/10 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.08)]" : "border-white/[0.08] text-slate-300 hover:border-amber-500/30 hover:bg-white/[0.04] bg-white/[0.02]";
            } else {
              if (isCorrect) btnClasses += "border-emerald-500/50 bg-emerald-500/10 text-emerald-300";
              else if (isSelected && !isCorrect) btnClasses += "border-red-500/50 bg-red-500/10 text-red-300";
              else btnClasses += "border-white/[0.06] text-slate-600 bg-white/[0.02] opacity-60";
            }

            return (
              <button key={idx} onClick={() => handleOptionSelect(option)} disabled={isSubmitted} className={btnClasses}>
                <span className="text-[15px]">{option}</span>
                {isSubmitted && isCorrect && <CheckCircle2 size={22} className="text-emerald-400 flex-shrink-0" />}
                {isSubmitted && isSelected && !isCorrect && <XCircle size={22} className="text-red-400 flex-shrink-0" />}
              </button>
            );
          })}
        </div>

        {isSubmitted && (
          <div className="p-6 md:p-8 border-t border-white/[0.06] flex flex-col md:flex-row items-start justify-between gap-6 animate-slide-up">
            <div className={`flex-1 p-5 rounded-2xl ${currentCheck?.correct ? 'bg-emerald-500/[0.08] border border-emerald-500/20' : 'bg-red-500/[0.08] border border-red-500/20'}`}>
              <h4 className={`font-bold mb-2 flex items-center ${currentCheck?.correct ? 'text-emerald-400' : 'text-red-400'}`}>
                {currentCheck?.correct ? 'Correct!' : 'Incorrect'}
              </h4>
              <p className={`text-sm leading-relaxed ${currentCheck?.correct ? 'text-emerald-300/80' : 'text-red-300/80'}`}>
                {currentCheck?.feedback && <span className="block mb-2 font-medium">{currentCheck.feedback}</span>}
                {isTextQuestion(currentQ) && <span className="block mb-2"><span className="font-semibold">Model answer:</span> {currentCheck?.correctAnswer}</span>}
                {currentCheck?.explanation}
              </p>
            </div>
            <button
              onClick={handleNext}
              disabled={submittingToServer}
              className="w-full md:w-auto bg-gradient-to-r from-amber-400 to-amber-500 text-[#0b1120] font-bold py-3 px-6 rounded-xl shadow-lg shadow-amber-900/20 btn-press flex items-center justify-center whitespace-nowrap cursor-pointer disabled:opacity-50"
            >
              {submittingToServer ? <Loader2 className="animate-spin w-5 h-5" /> : currentQuestion < quizData.length - 1 ? 'Next Question' : 'View Results'}
              {!submittingToServer && <ChevronRight size={20} className="ml-2" />}
            </button>
          </div>
        )}

        {!isSubmitted && (
          <div className="p-6 border-t border-white/[0.06] flex items-center justify-end gap-4">
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              onClick={handleSubmit}
              disabled={!selectedOption?.trim() || checking}
              className="w-full md:w-auto bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-[#0b1120] font-bold py-3 px-8 rounded-xl shadow-lg shadow-amber-900/20 btn-press disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {checking ? 'Checking...' : 'Submit Answer'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizEngine;
