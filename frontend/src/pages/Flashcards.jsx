import React, { useState, useEffect } from 'react';
import FlashcardViewer from '../components/FlashcardViewer';
import { Layers, Loader2, Zap } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Flashcards = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState('');
  const [flashcards, setFlashcards] = useState(null);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [loadingCards, setLoadingCards] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  // Fetch user docs on load
  useEffect(() => {
    const fetchDocs = async () => {
      if (!user) return;
      try {
        const { data } = await axios.get('http://localhost:5000/api/documents', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setDocuments(data);
        if (data.length > 0) setSelectedDocId(data[0]._id);
      } catch (err) {
        console.error('Error fetching docs', err);
      } finally {
        setLoadingDocs(false);
      }
    };
    fetchDocs();
  }, [user]);

  // Fetch flashcards when document changes
  useEffect(() => {
    const fetchCards = async () => {
      if (!selectedDocId || !user) return;
      setLoadingCards(true);
      setError('');
      setFlashcards(null);
      try {
        const { data } = await axios.get(`http://localhost:5000/api/flashcards/${selectedDocId}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        if (data.length > 0) {
           const mappedCards = data[0].cards.map(card => ({
             id: card._id,
             front: card.front,
             back: card.back
           }));
           setFlashcards(mappedCards);
        }
      } catch (err) {
        console.error('Error fetching cards', err);
      } finally {
        setLoadingCards(false);
      }
    };
    fetchCards();
  }, [selectedDocId, user]);

  const generateFlashcards = async () => {
    if (!selectedDocId || !user) return;
    setGenerating(true);
    setError('');
    try {
      const { data } = await axios.post(`http://localhost:5000/api/flashcards/generate/${selectedDocId}`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const mappedCards = data.cards.map(card => ({
        id: card._id,
        front: card.front,
        back: card.back
      }));
      setFlashcards(mappedCards);
    } catch (err) {
      setError(err.response?.data?.message || 'Error generating flashcards');
    } finally {
      setGenerating(false);
    }
  };

  if (loadingDocs) {
    return (
      <div className="flex flex-col flex-1 h-96 items-center justify-center text-gray-400">
        <Loader2 className="animate-spin mb-3" size={40} />
        <p>Loading your documents...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-indigo-600 dark:text-indigo-400 mb-5 shadow-inner">
          <Layers size={36} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">Review Your Flashcards</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto font-medium leading-relaxed">Master the material with spaced repetition. These flashcards were uniquely generated from your recent documents.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        {documents.length === 0 ? (
          <p className="text-gray-500">Please upload a document in Your Library first to review flashcards.</p>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Select a Document</label>
              <select 
                value={selectedDocId} 
                onChange={(e) => setSelectedDocId(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
              >
                {documents.map(doc => (
                  <option key={doc._id} value={doc._id}>{doc.title}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button 
                onClick={generateFlashcards}
                disabled={generating || loadingCards}
                className="h-[50px] px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {generating ? <><Loader2 className="animate-spin mr-2" size={18}/> Generating AI Flashcards...</> : <><Zap size={18} className="mr-2" /> Generate New Deck</>}
              </button>
            </div>
          </div>
        )}
        {error && <p className="text-red-500 text-sm mt-3 font-medium">{error}</p>}
      </div>

      <div className="min-h-[400px]">
        {loadingCards ? (
           <div className="flex flex-col items-center justify-center h-64 text-gray-400">
             <Loader2 className="animate-spin mb-3" size={32} />
             <p>Loading flashcard deck...</p>
           </div>
        ) : flashcards && flashcards.length > 0 ? (
           <FlashcardViewer cards={flashcards} />
        ) : selectedDocId && !generating ? (
           <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 text-center shadow-sm border border-gray-100 dark:border-gray-700 mx-auto flex flex-col items-center">
             <div className="bg-indigo-50 dark:bg-indigo-900 p-6 rounded-full text-indigo-400 mb-6">
               <Layers size={48} />
             </div>
             <h3 className="text-2xl font-bold mb-2 dark:text-white">No flashcards found</h3>
             <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">Click the "Generate New Deck" button above to use AI to automatically extract key concepts from your document.</p>
           </div>
        ) : null}
      </div>
    </div>
  );
};

export default Flashcards;
