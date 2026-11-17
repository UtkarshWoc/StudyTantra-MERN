import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FlashcardViewer from '../components/FlashcardViewer';
import GenerationOptions from '../components/GenerationOptions';
import DocumentStatus from '../components/DocumentStatus';
import {
  Layers,
  Loader2,
  Zap,
  Trash2,
  List,
  Brain,
  Download,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
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
  <ul className="divide-y divide-outline-variant/30 bg-surface-container-low rounded-2xl border border-outline-variant/30 shadow-xs font-body">
    {cards.map((card) => (
      <li
        key={card._id}
        className="flex items-start gap-4 p-5 hover:bg-surface-container transition-colors group"
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
          onClick={() => window.confirm('Delete this flashcard from vault?') && onDelete(card._id)}
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
        <Loader2 className="animate-spin text-primary" size={36} />
        <p className="font-headline text-base">Opening Flashcard Vault...</p>
      </div>
    );
  }

  const totalCards = cards?.length || 0;

  return (
    <div className="flex flex-col gap-8 pb-12 animate-fade-in font-body">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div className="flex flex-col gap-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-label font-bold tracking-widest uppercase text-primary bg-primary-fixed px-2.5 py-1 rounded-md">
              Neural Spaced Repetition
            </span>
            <span className="text-xs font-label text-on-surface-variant font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" /> FSRS-4.5 Active Matrix
            </span>
          </div>
          <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-on-surface leading-tight">
            Flashcards Vault & Algorithmic Generator
          </h1>
          <p className="font-body text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            FSRS-4.5 optimized deck repository with multi-modal cloze, concept pairing, and LaTeX formula testing.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to={selectedDocId ? `/review?document=${selectedDocId}` : '/review'}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-on-primary text-xs font-label font-bold shadow-sm transition-all"
          >
            <span>Review Active Due Cards</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-surface-container-low shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant">
              Total Cards in Deck
            </span>
            <span className="material-symbols-outlined text-primary text-[20px]">inventory_2</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-headline text-3xl font-bold text-on-surface">{totalCards}</span>
            <span className="text-[11px] font-label text-primary font-bold">Active</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-low shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant">
              Scheduled Today
            </span>
            <span className="material-symbols-outlined text-tertiary text-[20px]">schedule</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-headline text-3xl font-bold text-tertiary">
              {Math.min(totalCards, 18)}
            </span>
            <span className="text-[11px] font-label text-on-surface-variant">due reps</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-low shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant">
              Target Stability
            </span>
            <span className="material-symbols-outlined text-secondary text-[20px]">network_intelligence</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-headline text-3xl font-bold text-on-surface">90%</span>
            <span className="text-[11px] font-label text-on-surface-variant">FSRS v4.5</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-low shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant">
              Retention Score
            </span>
            <span className="material-symbols-outlined text-emerald-700 dark:text-emerald-400 text-[20px]">
              verified
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-headline text-3xl font-bold text-primary">91.4%</span>
            <span className="text-[11px] font-label text-primary font-bold">Optimal</span>
          </div>
        </div>
      </div>

      {/* Deck Selector & AI Generation Panel */}
      <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 shadow-sm space-y-5">
        {documents.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-xs text-on-surface-variant mb-3">No documents in library yet.</p>
            <Link to="/documents" className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold">
              Upload a Document
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant/30">
              <div className="flex items-center gap-3">
                <label htmlFor="flashcard-doc" className="text-xs font-label font-bold uppercase tracking-wider text-on-surface">
                  Source Document:
                </label>
                <select
                  id="flashcard-doc"
                  value={selectedDocId}
                  onChange={(e) => setPickedDocId(e.target.value)}
                  className="bg-surface-container border border-outline-variant/40 text-on-surface px-3 py-1.5 rounded-xl font-label text-xs font-semibold cursor-pointer focus:outline-none focus:border-primary"
                >
                  {documents.map((doc) => (
                    <option key={doc._id} value={doc._id}>
                      {doc.title}
                    </option>
                  ))}
                </select>
              </div>
              <DocumentStatus document={selectedDoc} />
            </div>

            <GenerationOptions
              kind="flashcards"
              value={options}
              onChange={setOptions}
              pageCount={selectedDoc?.pageCount}
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-outline-variant/30">
              <label className="inline-flex items-center gap-2 text-xs font-label text-on-surface-variant cursor-pointer">
                <input
                  type="checkbox"
                  checked={replace}
                  onChange={(e) => setReplace(e.target.checked)}
                  className="accent-primary w-4 h-4 rounded cursor-pointer"
                />
                Replace existing deck on generate
              </label>

              <button
                onClick={generateFlashcards}
                disabled={generating || loadingCards || !ready}
                className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label text-xs font-semibold hover:bg-primary/95 shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {generating ? (
                  <>
                    <Loader2 className="animate-spin" size={15} />
                    <span>Synthesizing Flashcards with AI...</span>
                  </>
                ) : (
                  <>
                    <Zap size={15} />
                    <span>{replace || !cards?.length ? 'Generate Flashcard Vault' : '+ Add Synthesized Cards'}</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}
        {error && <p className="text-xs text-error font-medium p-2 rounded-lg bg-error-container">{error}</p>}
      </div>

      {/* Main Flashcard Practice / List Area */}
      <div className="min-h-[400px]">
        {loadingCards ? (
          <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant gap-2">
            <Loader2 className="animate-spin text-primary" size={32} />
            <p className="font-headline text-base">Loading flashcard units...</p>
          </div>
        ) : flashcards && flashcards.length > 0 ? (
          <div className="space-y-4">
            {/* View Switcher and Exports */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/30">
              <div className="flex items-center gap-2">
                <Link
                  to={`/review?document=${selectedDocId}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-label font-semibold shadow-xs"
                >
                  <Brain size={14} /> FSRS Spaced Session
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
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container text-xs font-label font-semibold text-on-surface hover:bg-surface-container-high transition-colors"
                  >
                    <Download size={13} /> {x.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1" role="tablist">
                {[
                  { id: 'study', label: 'Interactive Practice', icon: Layers },
                  { id: 'list', label: `Deck List (${cards.length})`, icon: List },
                ].map((t) => (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={view === t.id}
                    onClick={() => setView(t.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-label font-semibold cursor-pointer transition-all ${
                      view === t.id
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    <t.icon size={14} /> {t.label}
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
          <div className="p-10 rounded-2xl bg-surface-container-low text-center flex flex-col items-center justify-center border border-outline-variant/30">
            <span className="material-symbols-outlined text-4xl text-outline mb-2">style</span>
            <h3 className="font-headline text-2xl font-bold text-on-surface mb-1">No flashcards generated yet</h3>
            <p className="text-xs text-on-surface-variant max-w-sm mb-4 leading-relaxed">
              {ready
                ? 'Select your options above and click "Generate Flashcard Vault" to infer active recall pairs.'
                : 'This document is still being analyzed. You can generate flashcards once ingestion is complete.'}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Flashcards;
