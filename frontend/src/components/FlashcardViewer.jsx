import React, { useState, useMemo } from 'react';
import { RotateCcw, Check, X as XIcon, Flame, AlertTriangle, RefreshCw } from 'lucide-react';

const FlashcardViewer = ({ cards = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [results, setResults] = useState([]);

  const displayCards = cards;
  const isFinished = currentIndex >= displayCards.length && displayCards.length > 0;

  const summary = useMemo(() => {
    if (!isFinished) return null;
    const topicStats = {};
    results.forEach(res => {
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
      strongTopics: strongTopics.sort((a,b) => b.percentage - a.percentage),
      weakTopics: weakTopics.sort((a,b) => a.percentage - b.percentage),
      totalKnown: results.filter(r => r.known).length,
      totalCards: results.length
    };
  }, [isFinished, results]);

  if (displayCards.length === 0) {
    return (
      <div className="w-full glass-card rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[300px] max-w-2xl mx-auto">
        <h3 className="text-xl font-bold text-white mb-2">No flashcards found</h3>
        <p className="text-slate-400">Generate a fresh deck to start studying.</p>
      </div>
    );
  }

  if (isFinished && summary) {
    return (
      <div className="w-full max-w-3xl mx-auto glass-card rounded-3xl p-8 animate-scale-in">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Revision Summary</h2>
          <p className="text-slate-400 text-lg">
            You scored <span className="font-bold text-amber-400">{summary.totalKnown} / {summary.totalCards}</span> correctly!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8 stagger-children">
          <div className="rounded-2xl p-6 bg-red-500/[0.06] border border-red-500/20">
            <div className="flex items-center text-red-400 font-bold text-lg mb-4">
              <AlertTriangle className="mr-2" size={20} /> Weak Topics
            </div>
            {summary.weakTopics.length > 0 ? (
              <ul className="space-y-2.5">
                {summary.weakTopics.map(t => (
                  <li key={t.topic} className="flex justify-between items-center bg-white/[0.04] p-3 rounded-xl border border-white/[0.06]">
                    <span className="font-semibold text-slate-200">{t.topic}</span>
                    <span className="text-xs font-bold px-2 py-1 bg-red-500/15 text-red-400 rounded-full">{Math.round(t.percentage)}%</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 text-sm italic">No weak spots. Great job!</p>
            )}
          </div>

          <div className="rounded-2xl p-6 bg-emerald-500/[0.06] border border-emerald-500/20">
            <div className="flex items-center text-emerald-400 font-bold text-lg mb-4">
              <Flame className="mr-2" size={20} /> Strong Topics
            </div>
            {summary.strongTopics.length > 0 ? (
              <ul className="space-y-2.5">
                {summary.strongTopics.map(t => (
                  <li key={t.topic} className="flex justify-between items-center bg-white/[0.04] p-3 rounded-xl border border-white/[0.06]">
                    <span className="font-semibold text-slate-200">{t.topic}</span>
                    <span className="text-xs font-bold px-2 py-1 bg-emerald-500/15 text-emerald-400 rounded-full">{Math.round(t.percentage)}%</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 text-sm italic">Keep studying to build strengths!</p>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={() => { setCurrentIndex(0); setResults([]); setIsFlipped(false); }}
            className="flex items-center bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-[#0b1120] font-bold py-3 px-8 rounded-xl shadow-lg shadow-amber-900/20 btn-press cursor-pointer"
          >
            <RefreshCw className="mr-2" size={20} /> Restart Deck
          </button>
        </div>
      </div>
    );
  }

  const currentCard = displayCards[currentIndex];

  const handleFlip = () => { if (!isFlipped) setIsFlipped(true); };

  const handleAnswer = (known) => {
    setResults([...results, { id: currentCard.id, topic: currentCard.topic, known }]);
    setIsFlipped(false);
    setTimeout(() => { setCurrentIndex(prev => prev + 1); }, 150);
  };

  return (
    <div className="max-w-2xl mx-auto w-full flex flex-col items-center animate-fade-in">
      {/* Progress Header */}
      <div className="w-full flex justify-between items-center mb-6">
        <span className="text-sm font-semibold text-slate-400 glass-card px-4 py-1.5 rounded-full tracking-wide">
          Card {currentIndex + 1} of {displayCards.length}
        </span>
        <span className="text-xs font-bold bg-amber-500/10 text-amber-400 px-3 py-1.5 rounded-lg border border-amber-500/20 uppercase tracking-wider">
          {currentCard.topic}
        </span>
      </div>

      {/* The Flashcard */}
      <div
        className="relative w-full aspect-[4/3] sm:aspect-[3/2] cursor-pointer group mb-10"
        onClick={handleFlip}
        style={{ perspective: '1000px' }}
      >
        <div
          className="w-full h-full duration-500 relative transition-transform rounded-3xl"
          style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
        >
          {/* Front (Question) */}
          <div
            className="absolute inset-0 glass-card gradient-border rounded-3xl flex flex-col p-8 md:p-12 items-center justify-center text-center"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          >
            <span className="absolute top-6 left-6 text-xs font-bold uppercase tracking-wider text-amber-500/60">Question</span>
            <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">{currentCard.front}</h3>
            <div className={`absolute bottom-6 flex items-center text-sm font-medium transition-all ${isFlipped ? 'opacity-0' : 'text-slate-500 opacity-80 group-hover:text-amber-400'}`}>
              <RotateCcw size={16} className="mr-2" />
              Click to reveal answer
            </div>
          </div>

          {/* Back (Answer) */}
          <div
            className="absolute inset-0 rounded-3xl flex flex-col p-8 md:p-12 items-center justify-center text-center bg-gradient-to-br from-amber-500 to-amber-600 border border-amber-400/30"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <span className="absolute top-6 left-6 text-xs font-bold uppercase tracking-wider text-amber-900/60">Answer</span>
            <p className="text-xl md:text-2xl font-medium text-[#0b1120] leading-relaxed overflow-y-auto max-h-full flex flex-col justify-center h-full">
              {currentCard.back}
            </p>
          </div>
        </div>
      </div>

      {/* Answer Controls */}
      <div className={`flex items-center justify-center space-x-4 w-full transition-all duration-300 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <button
          onClick={(e) => { e.stopPropagation(); handleAnswer(false); }}
          className="flex-1 max-w-[200px] flex justify-center items-center py-4 px-6 rounded-2xl glass-card text-red-400 font-bold text-lg border-2 border-transparent hover:border-red-500/30 hover:bg-red-500/10 hover:shadow-[0_0_20px_rgba(239,68,68,0.1)] transition-all duration-300 cursor-pointer"
        >
          <XIcon size={24} className="mr-2" strokeWidth={3} /> Not Yet
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); handleAnswer(true); }}
          className="flex-1 max-w-[200px] flex justify-center items-center py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-lg shadow-lg shadow-emerald-900/20 hover:shadow-emerald-500/20 transition-all duration-300 btn-press cursor-pointer"
        >
          <Check size={24} className="mr-2" strokeWidth={3} /> I Know This
        </button>
      </div>
    </div>
  );
};

export default FlashcardViewer;
