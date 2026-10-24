import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FlashcardViewer from '../components/FlashcardViewer';
import GenerationOptions from '../components/GenerationOptions';
import DocumentStatus from '../components/DocumentStatus';
import { Layers, Loader2, Zap, Trash2, List, Brain, Download } from 'lucide-react';
import { useDocuments, useFlashcards, useGenerateFlashcards, useDeleteFlashcard } from '../api/hooks';
import { getErrorMessage } from '../lib/api';
import { defaultOptions, toRequestBody } from '../lib/generation';
import { downloadFromApi } from '../lib/download';

const toViewerCard = (card) => ({ id: card._id, front: card.question, back: card.answer, topic: card.topic || 'General' });

const DeckList = ({ cards, onDelete }) => (
  <ul className="divide-y divide-white/[0.04] glass-card rounded-2xl">
    {cards.map((card) => (
      <li key={card._id} className="flex items-start gap-4 p-4 hover:bg-white/[0.02] transition-colors">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-100">{card.question}</p>
          <p className="text-sm text-slate-400 mt-1">{card.answer}</p>
          <span className="inline-block mt-2 text-[11px] font-bold uppercase tracking-wide text-amber-400">{card.topic}</span>
        </div>
        <button
          type="button"
          onClick={() => window.confirm('Delete this flashcard?') && onDelete(card._id)}
          aria-label="Delete flashcard"
          className="p-2 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
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
      <div className="flex flex-col flex-1 h-96 items-center justify-center text-slate-500">
        <Loader2 className="animate-spin mb-3" size={40} />
        <p>Loading your documents...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-4 bg-amber-500/10 rounded-2xl text-amber-400 mb-5 shadow-lg shadow-amber-500/10">
          <Layers size={36} />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">Flashcards</h1>
        <p className="text-slate-400 max-w-lg mx-auto font-medium leading-relaxed">Generate cards from a whole document, a page range, or a single topic, then study them.</p>
      </div>

      <div className="glass-card p-6 rounded-2xl space-y-5">
        {documents.length === 0 ? (
          <p className="text-slate-400">Please upload a document in Your Library first.</p>
        ) : (
          <>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="flashcard-doc" className="block text-sm font-bold text-slate-300">Document</label>
                <DocumentStatus document={selectedDoc} />
              </div>
              <select
                id="flashcard-doc"
                value={selectedDocId}
                onChange={(e) => setPickedDocId(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] text-slate-200 p-3 rounded-xl font-medium cursor-pointer focus:outline-none focus:border-amber-500/40 transition-all"
              >
                {documents.map(doc => <option key={doc._id} value={doc._id}>{doc.title}</option>)}
              </select>
            </div>

            <GenerationOptions kind="flashcards" value={options} onChange={setOptions} pageCount={selectedDoc?.pageCount} />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <label className="inline-flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                <input type="checkbox" checked={replace} onChange={(e) => setReplace(e.target.checked)} className="accent-amber-500" />
                Replace the existing deck
              </label>
              <button
                onClick={generateFlashcards}
                disabled={generating || loadingCards || !ready}
                className="h-12 px-6 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-[#0b1120] font-bold rounded-xl shadow-lg shadow-amber-900/20 btn-press flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {generating ? <><Loader2 className="animate-spin mr-2" size={18} /> Generating...</> : <><Zap size={18} className="mr-2" /> {replace || !cards?.length ? 'Generate Deck' : 'Add Cards'}</>}
              </button>
            </div>
          </>
        )}
        {error && <p className="text-red-400 text-sm font-medium animate-scale-in">{error}</p>}
      </div>

      <div className="min-h-[400px]">
        {loadingCards ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <Loader2 className="animate-spin mb-3" size={32} />
            <p>Loading flashcard deck...</p>
          </div>
        ) : flashcards && flashcards.length > 0 ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <Link to={`/review?document=${selectedDocId}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-[#0b1120] text-sm font-bold btn-press">
                  <Brain size={16} /> Review with spaced repetition
                </Link>
                {[{ format: 'csv', label: 'CSV' }, { format: 'anki', label: 'Anki' }].map((x) => (
                  <button
                    key={x.format}
                    type="button"
                    onClick={() => downloadFromApi(`/flashcards/export/${selectedDocId}?format=${x.format}`, `flashcards.${x.format === 'csv' ? 'csv' : 'txt'}`).catch(() => window.alert('Export failed. Please try again.'))}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl glass-card text-sm font-semibold text-slate-300 hover:text-amber-300 hover:border-amber-500/30 transition-all cursor-pointer"
                  >
                    <Download size={14} /> {x.label}
                  </button>
                ))}
              </div>
              <div className="flex justify-end gap-1" role="tablist">
                {[{ id: 'study', label: 'Practice all', icon: Layers }, { id: 'list', label: `All cards (${cards.length})`, icon: List }].map(t => (
                  <button key={t.id} role="tab" aria-selected={view === t.id} onClick={() => setView(t.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold cursor-pointer transition-all ${view === t.id ? 'bg-amber-500/10 text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}>
                    <t.icon size={15} /> {t.label}
                  </button>
                ))}
              </div>
            </div>
            {view === 'study'
              ? <FlashcardViewer key={`${selectedDocId}-${cards.length}`} cards={flashcards} />
              : <DeckList cards={cards} onDelete={(id) => deleteCard.mutate(id)} />}
          </>
        ) : selectedDocId && !generating && flashcards !== null ? (
          <div className="glass-card rounded-2xl p-10 text-center mx-auto flex flex-col items-center animate-slide-up">
            <div className="bg-amber-500/10 p-6 rounded-full text-amber-400 mb-6">
              <Layers size={48} />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-white">No flashcards yet</h3>
            <p className="text-slate-400 mb-6 max-w-sm">
              {ready ? 'Choose your options above and generate a deck. You can also select text in a document and turn it into a card.' : 'This document is still being processed. You can generate cards once it is ready.'}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Flashcards;
