import React, { useState } from 'react';
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
      setUserAnswers(latest.answers.map((a) => a.answer));
      setAttemptResults(latest.answers.map((a) => ({ correct: a.correct, feedback: a.feedback })));
      setScore(latest.score);
    }
  }

  if (quizData.length === 0) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-10 text-center max-w-2xl mx-auto flex flex-col items-center min-h-[300px] justify-center shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-surface-container text-on-surface-variant flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-3xl">quiz</span>
        </div>
        <h2 className="font-headline text-2xl font-bold text-on-surface mb-2">No quizzes available</h2>
        <p className="text-xs text-on-surface-variant max-w-md">
          Upload documents to generate quizzes and test your knowledge.
        </p>
      </div>
    );
  }

  const handleOptionSelect = (option) => {
    if (!isSubmitted) setSelectedOption(option);
  };

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
      if (data.correct) setScore((prev) => prev + 1);
      setIsSubmitted(true);
    } catch {
      setError('Could not check your answer. Please try again.');
    } finally {
      setChecking(false);
    }
  };

  const handleRetake = () => {
    setStarted(true);
    setShowResults(false);
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setUserAnswers([]);
    setChecks([]);
    setAttemptResults([]);
    setScore(0);
    setError('');
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
        setAttemptResults((data.attempt?.answers || []).map((a) => ({ correct: a.correct, feedback: a.feedback })));
      } catch (err) {
        console.error('Failed to save quiz results', err);
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
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-8 md:p-12 text-center max-w-2xl mx-auto shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-primary-fixed text-primary mx-auto flex items-center justify-center mb-5 shadow-xs">
          <span className="material-symbols-outlined text-3xl">bolt</span>
        </div>
        <h2 className="font-headline text-3xl font-bold text-on-surface mb-2">AI Generated Quiz</h2>
        <p className="text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto mb-8 leading-relaxed">
          Test your knowledge with AI-generated questions based on your document.
        </p>

        <div className="flex justify-center gap-12 py-4 mb-8 border-y border-outline-variant/20 max-w-xs mx-auto text-xs font-label">
          <div className="flex flex-col">
            <span className="font-headline text-2xl font-bold text-primary">{quizData.length}</span>
            <span className="text-on-surface-variant uppercase tracking-wider text-[10px] mt-0.5">Questions</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-2xl font-bold text-on-surface">~{Math.ceil(quizData.length * 0.5)}</span>
            <span className="text-on-surface-variant uppercase tracking-wider text-[10px] mt-0.5">Minutes</span>
          </div>
        </div>

        <button
          onClick={() => setStarted(true)}
          className="w-full sm:w-2/3 py-3 px-8 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label text-xs font-bold shadow-md hover:shadow-lg transition-all duration-150 transform active:scale-95 cursor-pointer"
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
      <div className="space-y-6 max-w-3xl mx-auto font-body">
        {/* Result Score Card */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-8 text-center shadow-sm">
          <div className="relative inline-block mb-4">
            <svg className="w-28 h-28 transform -rotate-90">
              <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-surface-container-high" />
              <circle
                cx="56"
                cy="56"
                r="48"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="301.6"
                strokeDashoffset={301.6 - (301.6 * percentage) / 100}
                strokeLinecap="round"
                className={`transition-all duration-700 ${percentage >= 70 ? 'text-primary' : 'text-tertiary'}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-headline text-2xl font-bold text-on-surface">{percentage}%</span>
            </div>
          </div>

          <h2 className="font-headline text-2xl font-bold text-on-surface mb-1">
            {percentage >= 70 ? '🎉 Great job!' : 'Keep practicing!'}
          </h2>
          <p className="text-xs text-on-surface-variant mb-6">
            You scored {score} out of {total} correct.
          </p>

          {error && <p className="text-xs text-error mb-4">{error}</p>}

          <div className="flex justify-center gap-3">
            <button
              onClick={handleRetake}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-label text-xs font-bold hover:bg-primary-container shadow-sm cursor-pointer"
            >
              <span>Retake Quiz</span>
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label text-xs font-semibold cursor-pointer"
            >
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        {/* Detailed Review List */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 md:p-8 shadow-sm">
          <h3 className="font-headline text-xl font-bold text-on-surface mb-6 pb-3 border-b border-outline-variant/20">
            Quiz Review
          </h3>

          <div className="space-y-6">
            {!reviewQuestions && <p className="text-xs text-on-surface-variant">Loading answers...</p>}
            {(reviewQuestions || []).map((q, idx) => {
              const userAnswer = userAnswers[idx];
              const hasUserAnswers = userAnswers.length > 0;

              return (
                <div key={idx} className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/20">
                  <h4 className="font-headline text-base font-bold text-on-surface mb-3">
                    {idx + 1}. {q.question}
                  </h4>

                  {isTextQuestion(q) ? (
                    <div className="space-y-2 mb-3 text-xs">
                      {hasUserAnswers && (
                        <div
                          className={`p-3 rounded-xl border ${
                            attemptResults[idx]?.correct
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                              : 'bg-error-container/30 border-error/30 text-error'
                          }`}
                        >
                          <span className="font-bold">Your answer: </span>
                          {userAnswer || <em>No answer</em>}
                          {attemptResults[idx]?.feedback && (
                            <p className="mt-1 text-[11px] opacity-80">{attemptResults[idx].feedback}</p>
                          )}
                        </div>
                      )}
                      <div className="p-3 rounded-xl border border-outline-variant/30 bg-surface-container-lowest text-on-surface">
                        <span className="font-bold">Model answer: </span>
                        {q.correctAnswer}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 mb-3 text-xs">
                      {q.options.map((opt, optIdx) => {
                        const isCorrectOpt = opt === q.correctAnswer;
                        const isUserPicked = userAnswer === opt;
                        let classes = 'p-3 rounded-xl border flex items-center justify-between ';

                        if (isCorrectOpt) {
                          classes += 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-semibold';
                        } else if (hasUserAnswers && isUserPicked) {
                          classes += 'bg-error-container/30 border-error/30 text-error font-semibold';
                        } else {
                          classes += 'bg-surface-container-lowest border-outline-variant/20 text-on-surface-variant';
                        }

                        return (
                          <div key={optIdx} className={classes}>
                            <span>{opt}</span>
                            {isCorrectOpt && (
                              <span className="material-symbols-outlined text-base text-emerald-600">check_circle</span>
                            )}
                            {hasUserAnswers && isUserPicked && !isCorrectOpt && (
                              <span className="material-symbols-outlined text-base text-error">cancel</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {q.explanation && (
                    <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 text-xs">
                      <span className="font-bold text-primary block mb-0.5">Explanation:</span>
                      <span className="text-on-surface-variant leading-relaxed">{q.explanation}</span>
                    </div>
                  )}
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
    <div className="max-w-3xl mx-auto w-full space-y-6 font-body">
      {/* Progress Track */}
      <div>
        <div className="flex justify-between text-xs font-label font-semibold text-on-surface-variant mb-2">
          <span>Question {currentQuestion + 1} of {quizData.length}</span>
          <span className="font-bold text-primary">Score: {score}</span>
        </div>
        <div className="w-full bg-surface-container-high rounded-full h-2 overflow-hidden">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / quizData.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 md:p-8 shadow-sm">
        <h3 className="font-headline text-2xl md:text-3xl font-bold text-on-surface leading-snug mb-6">
          {currentQ.question}
        </h3>

        <div className="space-y-3 mb-6">
          {isTextQuestion(currentQ) && (
            <textarea
              aria-label="Your answer"
              value={selectedOption ?? ''}
              onChange={(e) => !isSubmitted && setSelectedOption(e.target.value)}
              readOnly={isSubmitted}
              maxLength={1000}
              rows={currentQ.type === 'short_answer' ? 4 : 2}
              placeholder={
                currentQ.type === 'short_answer'
                  ? 'Write your answer in a sentence or two...'
                  : 'Type the missing word(s)...'
              }
              className="w-full p-4 rounded-xl border border-outline-variant/40 bg-surface-container-low text-on-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest resize-none leading-relaxed"
            />
          )}

          {!isTextQuestion(currentQ) &&
            currentQ.options.map((option, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const isSelected = selectedOption === option;
              const isCorrect = option === currentCheck?.correctAnswer;

              let btnClasses =
                'w-full text-left p-4 rounded-xl border transition-all text-sm font-medium flex items-center justify-between cursor-pointer ';

              if (!isSubmitted) {
                btnClasses += isSelected
                  ? 'border-primary ring-2 ring-primary/40 bg-primary/5 text-on-surface'
                  : 'border-outline-variant/30 bg-surface-container-lowest hover:bg-surface-container-low text-on-surface';
              } else {
                if (isCorrect) {
                  btnClasses += 'border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-semibold';
                } else if (isSelected && !isCorrect) {
                  btnClasses += 'border-error bg-error-container/30 text-error font-semibold';
                } else {
                  btnClasses += 'border-outline-variant/20 text-on-surface-variant opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(option)}
                  disabled={isSubmitted}
                  className={btnClasses}
                  type="button"
                >
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-label ${
                        isSelected && !isSubmitted
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container-high text-on-surface-variant'
                      }`}
                    >
                      {letter}
                    </span>
                    <span>{option}</span>
                  </div>

                  {isSubmitted && isCorrect && (
                    <span aria-hidden="true" className="material-symbols-outlined text-emerald-600">
                      check_circle
                    </span>
                  )}
                  {isSubmitted && isSelected && !isCorrect && (
                    <span aria-hidden="true" className="material-symbols-outlined text-error">
                      cancel
                    </span>
                  )}
                </button>
              );
            })}
        </div>

        {/* Answer Feedback / Explanation */}
        {isSubmitted && (
          <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 mb-6 animate-fade-in">
            <h4
              className={`font-headline text-lg font-bold mb-1 ${
                currentCheck?.correct ? 'text-emerald-700 dark:text-emerald-300' : 'text-error'
              }`}
            >
              {currentCheck?.correct ? 'Correct!' : 'Incorrect'}
            </h4>
            <div className="text-xs text-on-surface-variant leading-relaxed">
              {currentCheck?.feedback && <p className="mb-1 font-medium">{currentCheck.feedback}</p>}
              {isTextQuestion(currentQ) && (
                <p className="mb-1">
                  <span className="font-bold text-on-surface">Model answer:</span> {currentCheck?.correctAnswer}
                </p>
              )}
              {currentCheck?.explanation && <p>{currentCheck.explanation}</p>}
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/20">
          {error && <p className="text-xs text-error font-medium mr-auto">{error}</p>}

          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={!selectedOption?.trim() || checking}
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label text-xs font-bold shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              type="button"
            >
              {checking ? 'Checking...' : 'Submit Answer'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={submittingToServer}
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label text-xs font-bold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              type="button"
            >
              {submittingToServer
                ? 'Saving...'
                : currentQuestion < quizData.length - 1
                ? 'Next Question'
                : 'View Results'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizEngine;
