import React, { useState } from 'react';
import { checkQuizAnswer, useSubmitQuiz, useQuizAttempts } from '../api/hooks';

const isTextQuestion = (q) => q?.type === 'fill_blank' || q?.type === 'short_answer';

const QuizEngine = ({ quiz }) => {
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [confidence, setConfidence] = useState(3); // 1 = Low, 2 = Medium, 3 = High
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
  const [showHint, setShowHint] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState({});

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
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-10 text-center max-w-2xl mx-auto flex flex-col items-center min-h-[300px] justify-center shadow-[0_2px_16px_rgba(58,48,42,0.04)]">
        <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center text-on-surface-variant mb-4">
          <span className="material-symbols-outlined text-3xl">quiz</span>
        </div>
        <h2 className="font-headline text-2xl font-bold text-on-surface mb-2">No quizzes available</h2>
        <p className="text-sm text-on-surface-variant max-w-md">Generate quizzes from your uploaded documents to test your recall.</p>
      </div>
    );
  }

  const handleOptionSelect = (option) => {
    if (!isSubmitted) setSelectedOption(option);
  };

  const toggleFlag = (idx) => {
    setFlaggedQuestions((prev) => ({ ...prev, [idx]: !prev[idx] }));
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
    setShowHint(false);
    setFlaggedQuestions({});
  };

  const handleNext = async () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
      setShowHint(false);
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
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-8 md:p-12 text-center max-w-2xl mx-auto shadow-[0_2px_24px_rgba(58,48,42,0.06)] relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center mb-6 shadow-sm">
          <span className="material-symbols-outlined text-3xl">bolt</span>
        </div>
        <span className="text-[10px] font-label font-bold uppercase tracking-widest text-primary">Tantra Diagnostic Engine</span>
        <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-surface mt-2 mb-3">AI Mastery Assessment</h2>
        <p className="text-on-surface-variant max-w-md mx-auto text-sm leading-relaxed mb-8">
          Test your cognitive retrieval with curriculum-aligned questions, step-by-step rationales, and metacognitive calibration.
        </p>

        <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mb-8 py-4 border-y border-outline-variant/30">
          <div className="flex flex-col">
            <span className="text-2xl font-bold font-headline text-primary">{quizData.length}</span>
            <span className="text-xs font-label uppercase text-on-surface-variant">Questions</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold font-headline text-on-surface">~{Math.ceil(quizData.length * 1.5)}</span>
            <span className="text-xs font-label uppercase text-on-surface-variant">Minutes</span>
          </div>
        </div>

        <button
          onClick={() => setStarted(true)}
          className="w-full md:w-3/4 py-3.5 px-8 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label font-bold text-sm shadow-md hover:shadow-lg transition-all duration-150 transform active:scale-95 cursor-pointer inline-flex items-center justify-center gap-2"
        >
          <span>Start Quiz</span>
          <span aria-hidden="true" className="material-symbols-outlined text-lg">play_arrow</span>
        </button>
      </div>
    );
  }

  // --- REVIEW/RESULTS SCREEN ---
  if (showResults) {
    const total = quiz?.totalQuestions || quizData.length;
    const percentage = Math.round((score / total) * 100);
    const passed = percentage >= 70;

    return (
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Score Hero Card */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-8 md:p-10 text-center shadow-[0_2px_24px_rgba(58,48,42,0.06)] relative overflow-hidden">
          <div className="relative inline-block mb-6">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-surface-container-high" />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="351.8"
                strokeDashoffset={351.8 - (351.8 * percentage) / 100}
                strokeLinecap="round"
                className={`transition-all duration-1000 ease-out ${passed ? 'text-primary' : 'text-tertiary'}`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold font-headline text-on-surface">{percentage}%</span>
              <span className="text-[10px] font-label uppercase text-on-surface-variant font-semibold">Retention</span>
            </div>
          </div>

          <h2 className="font-headline text-2xl md:text-3xl font-bold text-on-surface mb-2">
            {passed ? 'Exceptional Mastery!' : 'Knowledge Gaps Identified'}
          </h2>
          <p className="text-on-surface-variant text-sm font-medium mb-6">
            You scored {score} out of {total} correct.
          </p>

          {error && <p className="text-sm text-error mb-4">{error}</p>}

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleRetake}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label text-xs font-bold hover:bg-primary-container hover:text-on-primary-container shadow-sm transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">replay</span>
              <span>Retake Quiz</span>
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label text-xs font-semibold transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        {/* Detailed Answer Review */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 md:p-8 shadow-[0_2px_16px_rgba(58,48,42,0.04)]">
          <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20 mb-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">fact_check</span>
              <h3 className="font-headline text-xl font-bold text-on-surface">Comprehensive Quiz Review</h3>
            </div>
            <span className="text-xs font-label font-medium text-on-surface-variant">{total} Invariant Checks</span>
          </div>

          <div className="space-y-6">
            {!reviewQuestions && <p className="text-sm text-on-surface-variant">Loading question rationales...</p>}
            {(reviewQuestions || []).map((q, idx) => {
              const userAnswer = userAnswers[idx];
              const hasUserAnswers = userAnswers.length > 0;
              const result = attemptResults[idx];
              const isCorrectResult = result?.correct ?? (userAnswer === q.correctAnswer);

              return (
                <div key={idx} className="bg-surface-container-low/70 border border-outline-variant/30 rounded-2xl p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <span className="text-xs font-label font-bold text-primary uppercase tracking-wider">
                      Question {idx + 1}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold font-label ${
                        isCorrectResult
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                          : 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                      }`}
                    >
                      {isCorrectResult ? 'Correct' : 'Needs Review'}
                    </span>
                  </div>

                  <h4 className="font-headline text-lg font-semibold text-on-surface mb-4">{q.question}</h4>

                  {isTextQuestion(q) ? (
                    <div className="space-y-2 mb-4 text-xs font-label">
                      {hasUserAnswers && (
                        <div
                          className={`p-3 rounded-xl border ${
                            isCorrectResult
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                              : 'bg-tertiary-fixed/30 border-tertiary/30 text-tertiary'
                          }`}
                        >
                          <span className="font-bold">Your answer: </span>
                          <span>{userAnswer || <em>No answer</em>}</span>
                          {result?.feedback && <p className="mt-1 opacity-85">{result.feedback}</p>}
                        </div>
                      )}
                      <div className="p-3 rounded-xl border border-outline-variant/30 bg-surface-container-lowest text-on-surface">
                        <span className="font-bold text-primary">Model answer: </span>
                        <span>{q.correctAnswer}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 mb-4 text-xs font-label">
                      {q.options.map((opt, optIdx) => {
                        const isCorrectOpt = opt === q.correctAnswer;
                        const isUserPicked = userAnswer === opt;
                        let optionStyle = 'bg-surface-container-lowest border-outline-variant/30 text-on-surface-variant';
                        if (isCorrectOpt) {
                          optionStyle = 'bg-emerald-500/10 border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-semibold';
                        } else if (hasUserAnswers && isUserPicked && !isCorrectOpt) {
                          optionStyle = 'bg-tertiary-fixed/30 border-tertiary/40 text-tertiary font-semibold';
                        }

                        return (
                          <div key={optIdx} className={`p-3 rounded-xl border flex items-center justify-between ${optionStyle}`}>
                            <span>{opt}</span>
                            {isCorrectOpt && <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>}
                            {hasUserAnswers && isUserPicked && !isCorrectOpt && (
                              <span className="material-symbols-outlined text-[18px] text-tertiary">cancel</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {q.explanation && (
                    <div className="mt-4 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 text-xs">
                      <span className="font-label font-bold text-primary uppercase tracking-wider block mb-1">
                        Analytical Proof &amp; Rationale:
                      </span>
                      <p className="text-on-surface-variant leading-relaxed">{q.explanation}</p>
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
  const progressPercent = Math.round(((currentQuestion + 1) / quizData.length) * 100);

  return (
    <div className="w-full space-y-6">
      {/* Top Assessment Telemetry Header */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-primary-fixed text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">bolt</span>
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-label font-bold uppercase tracking-widest text-primary">Live Assessment</span>
                <span className="text-xs text-outline">•</span>
                <span className="text-xs font-label text-on-surface-variant">Question {currentQuestion + 1} of {quizData.length}</span>
              </div>
              <h3 className="font-headline text-lg font-bold text-on-surface leading-tight">
                {quiz.title || 'Curriculum Retrieval Exercise'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">trophy</span>
              <span className="text-xs font-label font-bold text-on-surface">Score: {score}</span>
            </div>
            <button
              onClick={() => toggleFlag(currentQuestion)}
              type="button"
              className={`px-3 py-1.5 rounded-xl font-label text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                flaggedQuestions[currentQuestion]
                  ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {flaggedQuestions[currentQuestion] ? 'flag' : 'flag'}
              </span>
              <span>{flaggedQuestions[currentQuestion] ? 'Flagged' : 'Flag'}</span>
            </button>
          </div>
        </div>

        {/* Progress track */}
        <div className="mt-4 pt-3 border-t border-outline-variant/20">
          <div className="flex justify-between text-[11px] font-label text-on-surface-variant mb-1.5">
            <span>Assessment Progress</span>
            <span className="font-bold text-primary">{progressPercent}%</span>
          </div>
          <div className="w-full bg-surface-container-high rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Question Canvas + Diagnostic Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Question Area (8 cols on lg) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 md:p-8 shadow-[0_2px_16px_rgba(58,48,42,0.04)] relative">
            <div className="flex items-center justify-between pb-3">
              <span className="text-xs font-label font-bold uppercase tracking-wider text-primary">
                Problem Statement {currentQuestion + 1}
              </span>
              <span className="text-[11px] font-label text-on-surface-variant">
                {isTextQuestion(currentQ) ? 'Free Text Recall' : 'Single Best Option'}
              </span>
            </div>

            <h3 className="font-headline text-2xl md:text-3xl font-medium text-on-surface leading-tight mb-6">
              {currentQ.question}
            </h3>

            {/* Answer Options */}
            {isTextQuestion(currentQ) ? (
              <textarea
                aria-label="Your answer"
                value={selectedOption ?? ''}
                onChange={(e) => !isSubmitted && setSelectedOption(e.target.value)}
                readOnly={isSubmitted}
                maxLength={1000}
                rows={currentQ.type === 'short_answer' ? 4 : 2}
                placeholder={currentQ.type === 'short_answer' ? 'Write your concise explanation...' : 'Type the exact missing term...'}
                className="w-full p-4 rounded-xl border border-outline-variant/40 bg-surface-container-low text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest resize-none text-sm leading-relaxed"
              />
            ) : (
              <div className="space-y-3" id="answers-container">
                {currentQ.options.map((option, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  const isSelected = selectedOption === option;
                  const isCorrect = option === currentCheck?.correctAnswer;

                  let cardClasses =
                    'w-full text-left p-4 md:p-5 rounded-2xl border transition-all duration-150 flex items-start gap-3.5 cursor-pointer text-sm ';

                  if (!isSubmitted) {
                    if (isSelected) {
                      cardClasses += 'border-primary ring-2 ring-primary/40 bg-primary/5 text-on-surface shadow-sm';
                    } else {
                      cardClasses +=
                        'border-outline-variant/30 bg-surface-container-lowest hover:bg-surface-container-low text-on-surface shadow-[0_1px_6px_rgba(58,48,42,0.02)]';
                    }
                  } else {
                    if (isCorrect) {
                      cardClasses += 'border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/40';
                    } else if (isSelected && !isCorrect) {
                      cardClasses += 'border-tertiary bg-tertiary-fixed/30 text-tertiary ring-2 ring-tertiary/40';
                    } else {
                      cardClasses += 'border-outline-variant/20 bg-surface-container-low/50 text-on-surface-variant/60 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(option)}
                      disabled={isSubmitted}
                      className={cardClasses}
                      type="button"
                    >
                      <div
                        aria-hidden="true"
                        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold font-label transition-colors ${
                          isSelected && !isSubmitted
                            ? 'bg-primary text-on-primary'
                            : isSubmitted && isCorrect
                            ? 'bg-emerald-600 text-white'
                            : isSubmitted && isSelected && !isCorrect
                            ? 'bg-tertiary text-white'
                            : 'bg-surface-container-high text-on-surface-variant'
                        }`}
                      >
                        {isSubmitted && isCorrect ? (
                          <span className="material-symbols-outlined text-[16px]">check</span>
                        ) : isSubmitted && isSelected && !isCorrect ? (
                          <span className="material-symbols-outlined text-[16px]">close</span>
                        ) : (
                          letter
                        )}
                      </div>
                      <div className="flex-1 pt-0.5">
                        <span className="leading-snug block font-medium">{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Answer Evaluation Banner */}
            {isSubmitted && (
              <div className="mt-6 p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 animate-fade-in">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`material-symbols-outlined text-[22px] ${
                      currentCheck?.correct ? 'text-emerald-600' : 'text-tertiary'
                    }`}
                  >
                    {currentCheck?.correct ? 'verified' : 'error'}
                  </span>
                  <h4
                    className={`font-headline text-lg font-bold ${
                      currentCheck?.correct ? 'text-emerald-800 dark:text-emerald-300' : 'text-tertiary'
                    }`}
                  >
                    {currentCheck?.correct ? 'Correct!' : 'Incorrect'}
                  </h4>
                </div>

                {currentCheck?.feedback && (
                  <p className="text-xs font-medium text-on-surface-variant mb-2">{currentCheck.feedback}</p>
                )}
                {isTextQuestion(currentQ) && currentCheck?.correctAnswer && (
                  <p className="text-xs text-on-surface mb-2">
                    <span className="font-bold text-primary">Model answer:</span> {currentCheck.correctAnswer}
                  </p>
                )}
                {currentCheck?.explanation && (
                  <p className="text-xs md:text-sm text-on-surface leading-relaxed mt-2 pt-2 border-t border-outline-variant/20">
                    {currentCheck.explanation}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-4 shadow-sm">
            <button
              onClick={() => {
                if (currentQuestion > 0) {
                  setCurrentQuestion(currentQuestion - 1);
                  setSelectedOption(userAnswers[currentQuestion - 1] || null);
                  setIsSubmitted(Boolean(checks[currentQuestion - 1]));
                }
              }}
              disabled={currentQuestion === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-label font-bold transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              type="button"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-3 ml-auto">
              {error && <p className="text-xs text-error font-medium">{error}</p>}

              {!isSubmitted ? (
                <button
                  onClick={handleSubmit}
                  disabled={!selectedOption?.trim() || checking}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label text-xs font-bold shadow-sm transition-all duration-150 transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  type="button"
                >
                  {checking ? (
                    <>
                      <span aria-hidden="true" className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                      <span>Checking...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Answer</span>
                      <span aria-hidden="true" className="material-symbols-outlined text-[18px]">check</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={submittingToServer}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label text-xs font-bold shadow-sm transition-all duration-150 transform active:scale-95 cursor-pointer disabled:opacity-50"
                  type="button"
                >
                  {submittingToServer ? (
                    <>
                      <span aria-hidden="true" className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                      <span>Saving Results...</span>
                    </>
                  ) : currentQuestion < quizData.length - 1 ? (
                    <>
                      <span>Next Question</span>
                      <span aria-hidden="true" className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </>
                  ) : (
                    <>
                      <span>View Results</span>
                      <span aria-hidden="true" className="material-symbols-outlined text-[18px]">emoji_events</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Diagnostic Sidebar (4 cols on lg) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Question Matrix Card */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">dialpad</span>
                <h4 className="text-xs font-label font-bold uppercase tracking-wider text-on-surface">Question Matrix</h4>
              </div>
              <span className="text-[11px] font-label text-on-surface-variant font-medium">
                {Object.values(flaggedQuestions).filter(Boolean).length} Flagged
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {quizData.map((_, idx) => {
                const isCurrent = idx === currentQuestion;
                const isAnswered = Boolean(checks[idx]);
                const isFlagged = flaggedQuestions[idx];

                let pillClass =
                  'h-9 rounded-lg font-label text-xs font-bold flex items-center justify-center transition-all cursor-pointer relative ';
                if (isCurrent) {
                  pillClass += 'bg-primary text-on-primary ring-2 ring-primary/40 shadow-sm';
                } else if (isFlagged) {
                  pillClass += 'bg-tertiary-fixed text-on-tertiary-fixed-variant';
                } else if (isAnswered) {
                  pillClass += 'bg-surface-container-high text-primary font-semibold';
                } else {
                  pillClass += 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCurrentQuestion(idx);
                      setSelectedOption(userAnswers[idx] || null);
                      setIsSubmitted(Boolean(checks[idx]));
                    }}
                    className={pillClass}
                  >
                    <span>{String(idx + 1).padStart(2, '0')}</span>
                    {isFlagged && <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-tertiary" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Metacognitive Confidence Slider */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-label font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">psychology</span>
                Confidence
              </span>
              <span className="px-2 py-0.5 rounded-md bg-primary-fixed text-on-primary-fixed text-[11px] font-bold font-label">
                {confidence === 1 ? 'Low (Guess)' : confidence === 2 ? 'Medium (Partial)' : 'High (Certain)'}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed mb-3">
              Calibrate your certainty. StudyTantra adjusts future spaced interval weights based on metacognitive precision.
            </p>
            <input
              type="range"
              min="1"
              max="3"
              step="1"
              value={confidence}
              onChange={(e) => setConfidence(Number(e.target.value))}
              className="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          {/* Socratic Hint Widget */}
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[18px]">lightbulb</span>
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-label font-bold uppercase tracking-wider text-on-surface">Tantra Socratic Hint</h4>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Stuck on this concept? Request a subtle clue without revealing the direct answer.
                </p>
                {!showHint ? (
                  <button
                    onClick={() => setShowHint(true)}
                    type="button"
                    className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-lowest text-primary text-xs font-label font-bold hover:bg-primary hover:text-on-primary transition-colors cursor-pointer shadow-sm"
                  >
                    <span>Request Hint</span>
                  </button>
                ) : (
                  <div className="mt-3 p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-xs text-on-surface leading-relaxed animate-fade-in">
                    <span className="font-bold text-primary block mb-0.5">Clue:</span>
                    Pay close attention to key definitions, invariant requirements, and the relationship between cause and consequence.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizEngine;
