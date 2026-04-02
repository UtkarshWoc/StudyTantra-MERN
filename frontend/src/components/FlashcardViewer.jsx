import React, { useState, useMemo } from 'react';
import { RotateCcw, Check, X as XIcon, Flame, AlertTriangle, RefreshCw } from 'lucide-react';

const FlashcardViewer = ({ cards = [], onRestart }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Track user performance: array of { id, topic, known: boolean }
  const [results, setResults] = useState([]);
  
  const displayCards = cards;
  const isFinished = currentIndex >= displayCards.length && displayCards.length > 0;

  // Calculate summary stats when finished
  const summary = useMemo(() => {
    if (!isFinished) return null;
    
    const topicStats = {};
    results.forEach(res => {
      if (!topicStats[res.topic]) {
        topicStats[res.topic] = { total: 0, known: 0 };
      }
      topicStats[res.topic].total += 1;
      if (res.known) {
        topicStats[res.topic].known += 1;
      }
    });

    const strongTopics = [];
    const weakTopics = [];

    Object.entries(topicStats).forEach(([topic, stats]) => {
      const percentage = (stats.known / stats.total) * 100;
      if (percentage >= 60) {
        strongTopics.push({ topic, ...stats, percentage });
      } else {
        weakTopics.push({ topic, ...stats, percentage });
      }
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
      <div className="w-full bg-white dark:bg-gray-800 rounded-3xl p-12 text-center border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center min-h-[300px] max-w-2xl mx-auto transition-colors">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No flashcards found</h3>
        <p className="text-gray-500 dark:text-gray-400">Generate a fresh deck to start studying.</p>
      </div>
    );
  }

  // --- REVISION SUMMARY VIEW ---
  if (isFinished && summary) {
    return (
      <div className="w-full max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-lg animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Revision Summary</h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            You scored <span className="font-bold text-indigo-600 dark:text-indigo-400">{summary.totalKnown} / {summary.totalCards}</span> correctly!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Weak Topics */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-2xl p-6">
            <div className="flex items-center text-red-600 dark:text-red-400 font-bold text-lg mb-4">
              <AlertTriangle className="mr-2" /> Weak Topics (Focus Here)
            </div>
            {summary.weakTopics.length > 0 ? (
              <ul className="space-y-3">
                {summary.weakTopics.map(t => (
                  <li key={t.topic} className="flex justify-between items-center bg-white dark:bg-gray-800/50 p-3 rounded-lg shadow-sm">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{t.topic}</span>
                    <span className="text-xs font-bold px-2 py-1 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-full">
                      {Math.round(t.percentage)}%
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm italic">You don't have any major weak spots. Great job!</p>
            )}
          </div>

          {/* Strong Topics */}
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 rounded-2xl p-6">
            <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-bold text-lg mb-4">
              <Flame className="mr-2" /> Strong Topics (Mastered)
            </div>
            {summary.strongTopics.length > 0 ? (
              <ul className="space-y-3">
                {summary.strongTopics.map(t => (
                  <li key={t.topic} className="flex justify-between items-center bg-white dark:bg-gray-800/50 p-3 rounded-lg shadow-sm">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{t.topic}</span>
                    <span className="text-xs font-bold px-2 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-full">
                      {Math.round(t.percentage)}%
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm italic">Keep studying to turn those weak spots into strengths!</p>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button 
            onClick={() => {
              setCurrentIndex(0);
              setResults([]);
              setIsFlipped(false);
            }}
            className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <RefreshCw className="mr-2" size={20} /> Restart Deck
          </button>
        </div>
      </div>
    );
  }

  // --- STUDY VIEW ---
  const currentCard = displayCards[currentIndex];

  const handleFlip = () => {
    if (!isFlipped) setIsFlipped(true); // Once flipped, they must select know/don't know to proceed.
  };

  const handleAnswer = (known) => {
    // Record result
    setResults([...results, { id: currentCard.id, topic: currentCard.topic, known }]);
    
    // Move to next card, reset flip
    setIsFlipped(false);
    setTimeout(() => {
       setCurrentIndex(prev => prev + 1);
    }, 150); // slight delay to allow flip animation to finish
  };

  return (
    <div className="max-w-2xl mx-auto w-full flex flex-col items-center">
      {/* Progress Header */}
      <div className="w-full flex justify-between items-center mb-6">
        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-4 py-1.5 rounded-full shadow-sm border border-gray-100 dark:border-gray-700 tracking-wide transition-colors">
          Card {currentIndex + 1} of {displayCards.length}
        </span>
        <span className="text-xs font-bold bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-800/50 uppercase tracking-wider">
          Topic: {currentCard.topic}
        </span>
      </div>

      {/* The Flashcard */}
      <div 
        className="relative w-full aspect-[4/3] sm:aspect-[3/2] cursor-pointer group mb-10"
        onClick={handleFlip}
        style={{ perspective: '1000px' }}
      >
        <div 
          className="w-full h-full duration-500 relative transition-transform shadow-xl rounded-3xl"
          style={{ 
            transformStyle: 'preserve-3d', 
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' 
          }}
        >
          
          {/* Front (Question) */}
          <div 
            className="absolute inset-0 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl flex flex-col p-8 md:p-12 items-center justify-center text-center shadow-inner transition-colors"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          >
            <span className="absolute top-6 left-6 text-xs font-bold uppercase tracking-wider text-indigo-400 dark:text-indigo-500 opacity-60">Question</span>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 leading-tight">
              {currentCard.front}
            </h3>
            <div className={`absolute bottom-6 flex items-center text-sm font-medium transition-colors ${isFlipped ? 'opacity-0' : 'text-gray-400 dark:text-gray-500 opacity-80 group-hover:text-indigo-500 dark:group-hover:text-indigo-400'}`}>
              <RotateCcw size={16} className="mr-2" />
              Click to reveal answer
            </div>
          </div>

          {/* Back (Answer) */}
          <div 
            className="absolute inset-0 bg-indigo-600 dark:bg-indigo-700 border border-indigo-700 dark:border-indigo-800 rounded-3xl flex flex-col p-8 md:p-12 items-center justify-center text-center shadow-inner transition-colors"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <span className="absolute top-6 left-6 text-xs font-bold uppercase tracking-wider text-indigo-300 dark:text-indigo-400 opacity-80">Answer</span>
            <p className="text-xl md:text-2xl font-medium text-white leading-relaxed overflow-y-auto max-h-full scrollbar-thin flex flex-col justify-center h-full">
              {currentCard.back}
            </p>
          </div>
          
        </div>
      </div>

      {/* Answer Controls (Only visible when flipped) */}
      <div className={`flex items-center justify-center space-x-4 w-full transition-all duration-300 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <button 
          onClick={(e) => { e.stopPropagation(); handleAnswer(false); }} 
          className="flex-1 max-w-[200px] flex justify-center items-center py-4 px-6 rounded-2xl bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 font-bold text-lg shadow-sm border-2 border-transparent hover:border-red-200 dark:hover:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 hover:shadow-md transition-all cursor-pointer"
        >
          <XIcon size={24} className="mr-2" strokeWidth={3} /> Not Yet
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); handleAnswer(true); }}
          className="flex-1 max-w-[200px] flex justify-center items-center py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          <Check size={24} className="mr-2" strokeWidth={3} /> I Know This
        </button>
      </div>

    </div>
  );
};

export default FlashcardViewer;
