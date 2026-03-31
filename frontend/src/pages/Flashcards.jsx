import React from 'react';
import FlashcardViewer from '../components/FlashcardViewer';
import { Layers } from 'lucide-react';

const Flashcards = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto py-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-4 bg-indigo-50 rounded-2xl text-indigo-600 mb-5 shadow-inner">
          <Layers size={36} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Review Your Flashcards</h1>
        <p className="text-gray-500 max-w-lg mx-auto font-medium leading-relaxed">Master the material with spaced repetition. These flashcards were uniquely generated from your recent documents.</p>
      </div>

      <FlashcardViewer />
    </div>
  );
};

export default Flashcards;
