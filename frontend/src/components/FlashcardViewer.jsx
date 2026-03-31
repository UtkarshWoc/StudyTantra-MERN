import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, RotateCcw } from 'lucide-react';

const FlashcardViewer = ({ cards = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [favorites, setFavorites] = useState(new Set());

  const displayCards = cards;

  if (displayCards.length === 0) {
    return (
      <div className="w-full bg-white dark:bg-gray-800 rounded-3xl p-12 text-center border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center min-h-[300px] max-w-2xl mx-auto transition-colors">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No flashcards found</h3>
        <p className="text-gray-500 dark:text-gray-400">Upload documents and generate flashcards to start studying here.</p>
      </div>
    );
  }

  const currentCard = displayCards[currentIndex];
  const isFavorite = favorites.has(currentCard.id);

  const handleFlip = () => setIsFlipped(!isFlipped);
  
  const handleNext = () => {
    if (currentIndex < displayCards.length - 1) {
      setIsFlipped(false);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const toggleFavorite = (e) => {
    e.stopPropagation();
    const newFavs = new Set(favorites);
    if (newFavs.has(currentCard.id)) {
      newFavs.delete(currentCard.id);
    } else {
      newFavs.add(currentCard.id);
    }
    setFavorites(newFavs);
  };

  return (
    <div className="max-w-2xl mx-auto w-full flex flex-col items-center">
      {/* Progress & Actions Header */}
      <div className="w-full flex justify-between items-center mb-6">
        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-4 py-1.5 rounded-full shadow-sm border border-gray-100 dark:border-gray-700 uppercase tracking-wide transition-colors">
          Card {currentIndex + 1} of {displayCards.length}
        </span>
        <button 
          onClick={toggleFavorite}
          className={`p-2.5 rounded-full shadow-sm border border-gray-100 dark:border-gray-700 transition-colors cursor-pointer ${isFavorite ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-500 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900/50' : 'bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-yellow-500 dark:hover:text-yellow-400'}`}
        >
          <Star size={20} className={isFavorite ? 'fill-current' : ''} />
        </button>
      </div>

      {/* The Flashcard */}
      <div 
        className="relative w-full aspect-[4/3] sm:aspect-[3/2] cursor-pointer group"
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
            style={{ backfaceVisibility: 'hidden' }}
          >
            <span className="absolute top-6 left-6 text-xs font-bold uppercase tracking-wider text-indigo-400 dark:text-indigo-500 opacity-60">Question</span>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 leading-tight">
              {currentCard.front}
            </h3>
            <div className="absolute bottom-6 flex items-center text-sm font-medium text-gray-400 dark:text-gray-500 opacity-80 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
              <RotateCcw size={16} className="mr-2" />
              Click to reveal answer
            </div>
          </div>

          {/* Back (Answer) */}
          <div 
            className="absolute inset-0 bg-indigo-600 dark:bg-indigo-700 border border-indigo-700 dark:border-indigo-800 rounded-3xl flex flex-col p-8 md:p-12 items-center justify-center text-center shadow-inner transition-colors"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <span className="absolute top-6 left-6 text-xs font-bold uppercase tracking-wider text-indigo-300 dark:text-indigo-400 opacity-80">Answer</span>
            <p className="text-xl md:text-2xl font-medium text-white leading-relaxed">
              {currentCard.back}
            </p>
          </div>
          
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-6 mt-10 w-full">
        <button 
          onClick={handlePrev} 
          disabled={currentIndex === 0}
          className="p-3 md:p-4 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-sm border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer group"
        >
          <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === displayCards.length - 1}
          className="p-3 md:p-4 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white shadow-md hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer group"
        >
          <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default FlashcardViewer;
