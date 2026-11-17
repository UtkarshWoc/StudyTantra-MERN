import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FlashcardViewer from '../components/FlashcardViewer';
import GenerationOptions from '../components/GenerationOptions';
import DocumentStatus from '../components/DocumentStatus';
import { Layers, List, Brain, Download, Trash2, ArrowRight } from 'lucide-react';
import {
  useDocuments,
  useFlashcards,
  useGenerateFlashcards,
  useDeleteFlashcard,
  useSubmitReview,
} from '../api/hooks';
import { getErrorMessage } from '../lib/api';
import { defaultOptions, toRequestBody } from '../lib/generation';
import { downloadFromApi } from '../lib/download';

const toViewerCard = (card) => ({
  id: card._id,
  front: card.question,
  back: card.answer,
  topic: card.topic || 'General',
});

const DeckList = ({ cards, onDelete }) => (
  <ul className="divide-y divide-outline-variant/20 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs font-body">
    {cards.map((card) => (
      <li
        key={card._id}
        className="flex items-start gap-4 p-5 hover:bg-surface-container-low transition-colors group"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-label font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary-fixed text-primary">
              {card.topic}
            </span>
          </div>
          <p className="font-headline text-base sm:text-lg font-bold text-on-surface leading-snug">
            {card.question}
          </p>
          <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">{card.answer}</p>
        </div>
        <button
          type="button"
          onClick={() => window.confirm('Delete this flashcard?') && onDelete(card._id)}
          aria-label="Delete flashcard"
          className="p-2 rounded-lg text-outline hover:text-error hover:bg-error-container/20 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
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
  const submitReview = useSubmitReview();

  const generate = useGenerateFlashcards(selectedDocId);
  const generating = generate.isPending;
  const error = generate.error ? getErrorMessage(generate.error, 'Error generating flashcards') : '';

  const generateFlashcards = () => {
    if (!selectedDocId) return;
    generate.mutate(
      { ...toRequestBody(options, 'flashcards'), replace },
      { onSuccess: () => setReplace(false) }
    );
  };

  if (loadingDocs) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-on-surface-variant gap-3">
        <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
        <p className="font-label text-xs uppercase tracking-widest">Opening Flashcard Vault...</p>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-8 max-w-5xl mx-auto font-body">
      {/* Header Banner */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 md:p-8 shadow-[0_2px_16px_rgba(58,48,42,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1 rounded-md bg-primary-fixed text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">style</span>
            </span>
            <span className="text-[11px] font-label font-bold uppercase tracking-widest text-primary">
              Spaced Recall Vault
            </span>
          </div>
          <h1 className="font-headline text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
            Flashcards Vault
          </h1>
          <p className="font-body text-xs md:text-sm text-on-surface-variant mt-1">
            Generate and practice active recall cards from documents, whole chapters, or specific topics.
          </p>
        </div>

        {selectedDocId && (
          <Link
            to={`/review?document=${selectedDocId}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-label font-bold shadow-sm transition-all shrink-0"
          >
            <span>Review Active Cards</span>
            <ArrowRight size={15} />
          </Link>
        )}
      </div>

      {/* Generation & Deck Selector Panel */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 md:p-8 shadow-[0_2px_16px_rgba(58,48,42,0.04)] space-y-6">
        {documents.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-xs text-on-surface-variant mb-3">No documents uploaded yet.</p>
            <Link
              to="/documents"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-label font-bold"
            >
              Upload Document First
            </Link>
          </div>
        ) : (
          <>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="flashcard-doc"
                  className="block text-xs font-label font-bold uppercase tracking-wider text-on-surface"
                >
                  Source Document
                </label>
                <DocumentStatus document={selectedDoc} />
              </div>
              <select
                id="flashcard-doc"
                value={selectedDocId}
                onChange={(e) => setPickedDocId(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/40 text-on-surface p-3 rounded-xl font-body text-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all"
              >
                {documents.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    {doc.title}
                  </option>
                ))}
              </select>
            </div>

            <GenerationOptions
              kind="flashcards"
              value={options}
              onChange={setOptions}
              pageCount={selectedDoc?.pageCount}
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-outline-variant/20">
              <label className="inline-flex items-center gap-2 text-xs font-medium text-on-surface-variant cursor-pointer">
                <input
                  type="checkbox"
                  checked={replace}
                  onChange={(e) => setReplace(e.target.checked)}
                  className="accent-primary w-4 h-4 rounded"
                />
                <span>Replace existing deck for this document</span>
              </label>

              <button
                onClick={generateFlashcards}
                disabled={generating || loadingCards || !ready}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label text-xs font-bold shadow-md hover:shadow-lg transition-all duration-150 transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                type="button"
              >
                {generating ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                    <span>Generating Cards...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                    <span>{replace || !cards?.length ? 'Generate Deck' : 'Add More Cards'}</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {error && <p className="text-xs text-error font-medium">{error}</p>}
      </div>

      {/* Deck Viewer & Practice Section */}
      <div className="min-h-[400px]">
        {loadingCards ? (
          <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
            <span className="material-symbols-outlined text-3xl text-primary animate-spin mb-3">progress_activity</span>
            <p className="text-xs font-label uppercase tracking-widest">Loading flashcard deck...</p>
          </div>
        ) : flashcards && flashcards.length > 0 ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  to={`/review?document=${selectedDocId}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-label font-bold shadow-sm"
                >
                  <Brain size={15} />
                  <span>Review Spaced Intervals</span>
                </Link>

                {[{ format: 'csv', label: 'CSV' }, { format: 'anki', label: 'Anki' }].map((x) => (
                  <button
                    key={x.format}
                    type="button"
                    onClick={() =>
                      downloadFromApi(
                        `/flashcards/export/${selectedDocId}?format=${x.format}`,
                        `flashcards.${x.format === 'csv' ? 'csv' : 'txt'}`
                      ).catch(() => window.alert('Export failed. Please try again.'))
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 text-xs font-label font-medium text-on-surface transition-colors cursor-pointer"
                  >
                    <Download size={14} />
                    <span>{x.label}</span>
                  </button>
                ))}
              </div>

              {/* View Switcher: Practice All vs All Cards */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-container-low border border-outline-variant/30" role="tablist">
                {[
                  { id: 'study', label: 'Practice Deck', icon: Layers },
                  { id: 'list', label: `All Cards (${cards.length})`, icon: List },
                ].map((t) => (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={view === t.id}
                    onClick={() => setView(t.id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-label font-bold transition-all cursor-pointer ${
                      view === t.id
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <t.icon size={14} />
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {view === 'study' ? (
              <FlashcardViewer
                key={`${selectedDocId}-${cards.length}`}
                cards={flashcards}
                onCardReviewed={(id, rating) => submitReview.mutate({ id, rating })}
              />
            ) : (
              <DeckList cards={cards} onDelete={(id) => deleteCard.mutate(id)} />
            )}
          </div>
        ) : selectedDocId && !generating && flashcards !== null ? (
          <div className="text-center py-20 bg-surface-container-lowest border border-dashed border-outline-variant/40 rounded-3xl p-8">
            <div className="w-16 h-16 rounded-2xl bg-primary-fixed text-primary mx-auto flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-3xl">style</span>
            </div>
            <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">No Flashcards Generated Yet</h3>
            <p className="text-xs text-on-surface-variant max-w-sm mx-auto mb-6">
              {ready
                ? 'Select generation options above to synthesize cards from this document.'
                : 'This document is still processing. Flashcards will become available once ready.'}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Flashcards;
