import React, { useState } from 'react';
import FlashcardViewer from '../components/FlashcardViewer';
import GenerationOptions from '../components/GenerationOptions';
import DocumentStatus from '../components/DocumentStatus';
import { Layers, Loader2, Zap, Trash2, List } from 'lucide-react';
import { useDocuments, useFlashcards, useGenerateFlashcards, useDeleteFlashcard } from '../api/hooks';
import { getErrorMessage } from '../lib/api';
import { defaultOptions, toRequestBody } from '../lib/generation';

const toViewerCard = (card) => ({ id: card._id, front: card.question, back: card.answer, topic: card.topic || 'General' });

const DeckList = ({ cards, onDelete }) => (
  <ul className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
    {cards.map((card) => (
      <li key={card._id} className="flex items-start gap-4 p-4">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 dark:text-gray-100">{card.question}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{card.answer}</p>
          <span className="inline-block mt-2 text-[11px] font-bold uppercase tracking-wide text-amber-600 dark:text-amber-400">{card.topic}</span>
        </div>
        <button
          type="button"
          onClick={() => window.confirm('Delete this flashcard?') && onDelete(card._id)}
          aria-label="Delete flashcard"
          className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
        >
          <Trash2 size={16} />
        </button>
      </li>
    ))}
  </ul>
);

const Flashcards = () => {
  const { data: documents = [], isLoading: loadingDocs } = useDocuments();
  const [pickedDocId, setPickedDocId] = useState('');
  const selectedDocId = pickedDocId || documents[0]?._id || '';
  const selectedDoc = documents.find((d) => d._id === selectedDocId);
  const ready = selectedDoc?.status === 'ready';

  const [options, setOptions] = useState(() => defaultOptions('flashcards'));
  const [replace, setReplace] = useState(false);
  const [view, setView] = useState('study');

  const { data: cards, isLoading: loadingCards } = useFlashcards(selectedDocId);
  const flashcards = cards ? cards.map(toViewerCard) : null;
  const deleteCard = useDeleteFlashcard(selectedDocId);

  const generate = useGenerateFlashcards(selectedDocId);
  const generating = generate.isPending;
  const error = generate.error ? getErrorMessage(generate.error, 'Error generating flashcards') : '';
  const generateFlashcards = () => {
    if (!selectedDocId) return;
    generate.mutate({ ...toRequestBody(options, 'flashcards'), replace }, { onSuccess: () => setReplace(false) });
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
        <div className="inline-flex items-center justify-center p-4 bg-amber-500/10 rounded-2xl text-amber-500 mb-5">
          <Layers size={36} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">Flashcards</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto font-medium leading-relaxed">Generate cards from a whole document, a page range, or a single topic, then study them.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-5">
        {documents.length === 0 ? (
          <p className="text-gray-500">Please upload a document in Your Library first.</p>
        ) : (
          <>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="flashcard-doc" className="block text-sm font-bold text-gray-700 dark:text-gray-300">Document</label>
                <DocumentStatus document={selectedDoc} />
              </div>
              <select
                id="flashcard-doc"
                value={selectedDocId}
                onChange={(e) => setPickedDocId(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 p-3 rounded-xl font-medium cursor-pointer"
              >
                {documents.map(doc => (
                  <option key={doc._id} value={doc._id}>{doc.title}</option>
                ))}
              </select>
            </div>

            <GenerationOptions kind="flashcards" value={options} onChange={setOptions} pageCount={selectedDoc?.pageCount} />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <label className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                <input type="checkbox" checked={replace} onChange={(e) => setReplace(e.target.checked)} className="accent-amber-500" />
                Replace the existing deck
              </label>
              <button
                onClick={generateFlashcards}
                disabled={generating || loadingCards || !ready}
                className="h-12 px-6 bg-amber-500 hover:bg-amber-600 text-[#0b1120] font-bold rounded-xl shadow-md transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {generating ? <><Loader2 className="animate-spin mr-2" size={18} /> Generating...</> : <><Zap size={18} className="mr-2" /> {replace || !cards?.length ? 'Generate Deck' : 'Add Cards'}</>}
              </button>
            </div>
          </>
        )}
        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
      </div>

      <div className="min-h-[400px]">
        {loadingCards ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <Loader2 className="animate-spin mb-3" size={32} />
            <p>Loading flashcard deck...</p>
          </div>
        ) : flashcards && flashcards.length > 0 ? (
          <>
            <div className="flex justify-end gap-1 mb-4" role="tablist">
              {[{ id: 'study', label: 'Study', icon: Layers }, { id: 'list', label: `All cards (${cards.length})`, icon: List }].map(t => (
                <button key={t.id} role="tab" aria-selected={view === t.id} onClick={() => setView(t.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold cursor-pointer ${view === t.id ? 'bg-amber-500/15 text-amber-500' : 'text-gray-500 hover:text-gray-300'}`}>
                  <t.icon size={15} /> {t.label}
                </button>
              ))}
            </div>
            {view === 'study'
              ? <FlashcardViewer key={`${selectedDocId}-${cards.length}`} cards={flashcards} />
              : <DeckList cards={cards} onDelete={(id) => deleteCard.mutate(id)} />}
          </>
        ) : selectedDocId && !generating && flashcards !== null ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 text-center shadow-sm border border-gray-100 dark:border-gray-700 mx-auto flex flex-col items-center">
            <div className="bg-amber-500/10 p-6 rounded-full text-amber-500 mb-6">
              <Layers size={48} />
            </div>
            <h3 className="text-2xl font-bold mb-2 dark:text-white">No flashcards yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
              {ready ? 'Choose your options above and generate a deck. You can also select text in a document and turn it into a card.' : 'This document is still being processed. You can generate cards once it is ready.'}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Flashcards;
