import React, { useState, useMemo } from 'react';
import { RotateCcw, Check, X as XIcon, Flame, AlertTriangle, RefreshCw } from 'lucide-react';
import Markdown from './Markdown';

const FlashcardViewer = ({ cards = [], onCardReviewed }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [results, setResults] = useState([]);

  const displayCards = cards;
  const isFinished = currentIndex >= displayCards.length && displayCards.length > 0;

  const summary = useMemo(() => {
    if (!isFinished) return null;
    const topicStats = {};
    results.forEach((res) => {
      if (!topicStats[res.topic]) topicStats[res.topic] = { total: 0, known: 0 };
      topicStats[res.topic].total += 1;
      if (res.known) topicStats[res.topic].known += 1;
    });
    const strongTopics = [];
    const weakTopics = [];
    Object.entries(topicStats).forEach(([topic, stats]) => {
      const percentage = (stats.known / stats.total) * 100;
      if (percentage >= 60) strongTopics.push({ topic, ...stats, percentage });
      else weakTopics.push({ topic, ...stats, percentage });
    });
    return {
      strongTopics: strongTopics.sort((a, b) => b.percentage - a.percentage),
      weakTopics: weakTopics.sort((a, b) => a.percentage - b.percentage),
      totalKnown: results.filter((r) => r.known).length,
      totalCards: results.length,
    };
  }, [isFinished, results]);

  if (displayCards.length === 0) {
    return (
      <div className="w-full bg-surface-container-low rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[300px] max-w-2xl mx-auto border border-outline-variant/30">
        <span className="material-symbols-outlined text-4xl text-outline mb-2">style</span>
        <h3 className="font-headline text-2xl font-bold text-on-surface mb-1">No flashcards found</h3>
        <p className="text-xs text-on-surface-variant font-body">Generate a fresh deck to begin active recall.</p>
      </div>
    );
  }

  if (isFinished && summary) {
    return (
      <div className="w-full max-w-3xl mx-auto bg-surface-container-low rounded-3xl p-8 sm:p-10 border border-outline-variant/30 shadow-sm animate-scale-in font-body">
        <div className="text-center mb-8">
          <span className="text-[11px] font-label font-bold uppercase tracking-widest text-primary bg-primary-fixed px-3 py-1 rounded-full">
            Revision Session Complete
          </span>
          <h2 className="font-headline text-3xl sm:text-4xl font-bold text-on-surface mt-3 mb-2">
            Session Performance Summary
          </h2>
          <p className="text-sm text-on-surface-variant font-body">
            You scored <strong className="text-primary font-bold">{summary.totalKnown} / {summary.totalCards}</strong> items correctly ({Math.round((summary.totalKnown / Math.max(1, summary.totalCards)) * 100)}% retention).
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-2xl p-6 bg-error-container/40 border border-error/20">
            <div className="flex items-center text-error font-bold text-base mb-3 font-headline">
              <AlertTriangle className="mr-2" size={18} /> Priority Weak Topics
            </div>
            {summary.weakTopics.length > 0 ? (
              <ul className="space-y-2">
                {summary.weakTopics.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-on-surface">{item.topic}</span>
                    <span className="text-error font-bold font-label">
                      {Math.round(item.percentage)}% ({item.known}/{item.total})
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-on-surface-variant">No critical weaknesses detected in this run.</p>
            )}
          </div>

          <div className="rounded-2xl p-6 bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center text-emerald-700 dark:text-emerald-400 font-bold text-base mb-3 font-headline">
              <Flame className="mr-2" size={18} /> High Retention Topics
            </div>
            {summary.strongTopics.length > 0 ? (
              <ul className="space-y-2">
                {summary.strongTopics.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-on-surface">{item.topic}</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold font-label">
                      {Math.round(item.percentage)}% ({item.known}/{item.total})
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-on-surface-variant">Keep drilling to cement foundational recall.</p>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => {
              setCurrentIndex(0);
              setIsFlipped(false);
              setResults([]);
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-on-primary font-label text-xs font-semibold hover:bg-primary/95 transition-all shadow-sm cursor-pointer"
          >
            <RefreshCw size={15} /> Practice Deck Again
          </button>
        </div>
      </div>
    );
  }

  const currentCard = displayCards[currentIndex];

  const handleResponse = (known) => {
    onCardReviewed?.(currentCard.id, known ? 'good' : 'again');
    setResults((prev) => [...prev, { id: currentCard.id, topic: currentCard.topic, known }]);
    setIsFlipped(false);
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center select-none font-body">
      {/* Session Header / Progress */}
      <div className="w-full flex items-center justify-between mb-4 px-1 text-xs font-label">
        <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface font-semibold text-[11px]">
          {currentCard.topic}
        </span>
        <span className="text-on-surface-variant font-medium">
          Card <strong className="text-on-surface">{currentIndex + 1}</strong> of {displayCards.length}
        </span>
      </div>

      {/* 3D Flashcard Container */}
      <div
        className="w-full min-h-[340px] perspective-1000 cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={`relative w-full min-h-[340px] rounded-3xl p-8 sm:p-10 flex flex-col justify-between transition-transform duration-500 transform-style-3d bg-surface-container-lowest border border-outline-variant/30 shadow-md ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Card Front */}
          <div className={`flex flex-col justify-between h-full backface-hidden ${isFlipped ? 'hidden' : 'flex'}`}>
            <div>
              <span className="text-[10px] font-label font-bold uppercase tracking-widest text-primary">
                Question / Prompt
              </span>
              <div className="mt-4 font-headline text-2xl sm:text-3xl text-on-surface font-semibold leading-snug">
                <Markdown>{currentCard.front}</Markdown>
              </div>
            </div>
            <div className="pt-6 flex items-center justify-between text-xs text-outline font-label">
              <span className="flex items-center gap-1.5">
                <RotateCcw size={14} /> Click card to reveal answer
              </span>
              <span className="text-[11px] font-mono">FSRS Active</span>
            </div>
          </div>

          {/* Card Back */}
          <div
            className={`flex flex-col justify-between h-full rotate-y-180 backface-hidden ${
              isFlipped ? 'flex' : 'hidden'
            }`}
          >
            <div>
              <span className="text-[10px] font-label font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                Verified Conceptual Answer
              </span>
              <div className="mt-4 font-body text-sm sm:text-base text-on-surface leading-relaxed">
                <Markdown>{currentCard.back}</Markdown>
              </div>
            </div>
            <div className="pt-6 flex items-center justify-between text-xs text-outline font-label">
              <span>Rate your recall certainty below</span>
              <span className="text-[11px] font-mono">Space to flip</span>
            </div>
          </div>
        </div>
      </div>

      {/* Answer Controls */}
      {isFlipped ? (
        <div className="flex gap-4 mt-6 w-full max-w-md animate-slide-up">
          <button
            onClick={() => handleResponse(false)}
            className="flex-1 py-3 px-4 rounded-xl bg-error-container text-on-error-container font-label text-xs font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <XIcon size={16} /> Need Review (Again)
          </button>
          <button
            onClick={() => handleResponse(true)}
            className="flex-1 py-3 px-4 rounded-xl bg-primary text-on-primary font-label text-xs font-bold hover:bg-primary/95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Check size={16} /> Mastered (Good)
          </button>
        </div>
      ) : (
        <div className="mt-6 text-xs text-on-surface-variant font-label">
          Click the card surface or press <kbd className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface font-semibold">Space</kbd> to inspect solution
        </div>
      )}
    </div>
  );
};

export default FlashcardViewer;
