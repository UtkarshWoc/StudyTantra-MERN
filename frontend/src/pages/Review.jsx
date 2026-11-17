import React, { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Loader2, RotateCcw, CheckCircle2, Brain, Sparkles, ArrowLeft, Timer } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useReviewQueue, useSubmitReview } from '../api/hooks';
import { formatInterval } from '../lib/time';
import { getErrorMessage } from '../lib/api';

const RATINGS = [
  {
    value: 1,
    label: 'Again',
    key: '1',
    intervalFallback: '< 10m',
    subtext: 'Reset Interval',
    desc: 'Memory Lapse',
    btnClass:
      'bg-surface-container-lowest hover:bg-error-container text-on-surface hover:text-on-error-container border border-outline-variant/30 hover:border-error/40',
    badgeClass: 'bg-error-container text-error',
    colorText: 'text-error',
  },
  {
    value: 2,
    label: 'Hard',
    key: '2',
    intervalFallback: '1.2d',
    subtext: 'High Decay',
    desc: 'Partial Recall',
    btnClass:
      'bg-surface-container-lowest hover:bg-surface-container-high text-on-surface border border-outline-variant/30 hover:border-primary/40',
    badgeClass: 'bg-surface-container text-on-surface-variant',
    colorText: 'text-secondary',
  },
  {
    value: 3,
    label: 'Good',
    key: '3',
    intervalFallback: '3d',
    subtext: 'Optimal Spacing',
    desc: 'Target Stability',
    btnClass:
      'bg-surface-container-lowest hover:bg-primary-fixed text-on-surface border border-outline-variant/30 hover:border-primary/50',
    badgeClass: 'bg-primary-fixed text-primary',
    colorText: 'text-primary',
  },
  {
    value: 4,
    label: 'Easy',
    key: '4',
    intervalFallback: '9d',
    subtext: 'Consolidated',
    desc: 'Peak Retention',
    btnClass:
      'bg-surface-container-lowest hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-on-surface border border-outline-variant/30 hover:border-emerald-500/40',
    badgeClass: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400',
    colorText: 'text-emerald-700 dark:text-emerald-400',
  },
];

/**
 * Spaced-repetition session (Sahara Edition).
 * The queue is fetched once per session; "Again" cards re-queue for immediate consolidation.
 */
const ReviewSession = ({ initialCards, onFinished }) => {
  const [queue, setQueue] = useState(initialCards);
  const [flipped, setFlipped] = useState(false);
  const [stats, setStats] = useState({ reviewed: 0, again: 0 });
  const [error, setError] = useState('');
  const submit = useSubmitReview();
  const card = queue[0];

  const totalSessionCards = initialCards.length;
  const progressPct = totalSessionCards > 0 ? Math.min(100, Math.round((stats.reviewed / totalSessionCards) * 100)) : 0;

  const rate = useCallback(
    (rating) => {
      if (!card || !flipped || submit.isPending) return;
      setError('');
      submit.mutate(
        { id: card._id, rating },
        {
          onSuccess: () => {
            setStats((s) => ({ reviewed: s.reviewed + 1, again: s.again + (rating === 1 ? 1 : 0) }));
            setFlipped(false);
            setQueue((q) => (rating === 1 ? [...q.slice(1), { ...q[0], isNew: false }] : q.slice(1)));
          },
          onError: (err) => setError(getErrorMessage(err, 'Could not save review response.')),
        }
      );
    },
    [card, flipped, submit]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest('input, textarea, select')) return;
      if (e.code === 'Space' && !e.target.closest('button, a')) {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (['1', '2', '3', '4'].includes(e.key)) {
        rate(Number(e.key));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [rate]);

  if (!card) {
    return (
      <div className="bg-surface-container-low rounded-3xl p-8 sm:p-12 text-center border border-outline-variant/30 max-w-xl mx-auto shadow-sm animate-scale-in font-body">
        <CheckCircle2 className="mx-auto text-emerald-600 mb-4" size={48} />
        <h2 className="font-headline text-3xl font-bold text-on-surface mb-2">Session complete</h2>
        <p className="text-xs sm:text-sm text-on-surface-variant mb-6 leading-relaxed">
          You reviewed {stats.reviewed} card{stats.reviewed === 1 ? '' : 's'}
          {stats.again ? `, and repeated ${stats.again} for memory reinforcement` : ''}. Your FSRS decay intervals have been calibrated.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onFinished}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-label text-xs font-semibold hover:bg-primary/95 transition-all shadow-xs cursor-pointer"
          >
            <RotateCcw size={15} /> Check for more
          </button>
          <Link
            to="/dashboard"
            className="px-5 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container font-label text-xs font-semibold text-on-surface hover:bg-surface-container-high transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col gap-6 font-body">
      {/* Session Progress Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              to="/flashcards"
              className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
              title="Exit to Vault"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <span className="text-[10px] font-label font-bold uppercase tracking-widest text-primary block leading-none">
                Active Recall Session • FSRS v4.5
              </span>
              <span className="font-headline text-base sm:text-lg font-bold text-on-surface leading-tight mt-0.5 block truncate max-w-sm">
                {card.documentTitle || 'Spaced Practice'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-label">
            <span className="text-on-surface-variant font-medium">
              <strong className="text-on-surface">{queue.length} left</strong> · {stats.reviewed} done
            </span>
            <div className="flex items-center gap-1.5">
              {card.isNew && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary-fixed text-primary">
                  New
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-surface-container text-on-surface-variant uppercase tracking-wider">
                {card.topic}
              </span>
            </div>
          </div>
        </div>

        {/* Micro Progress Line */}
        <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Main Focus Card Canvas */}
      <article className="relative w-full rounded-3xl bg-surface-container-lowest p-8 sm:p-12 shadow-sm border border-outline-variant/30 flex flex-col justify-between min-h-[360px] transition-all">
        {/* Card Header */}
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20">
          <span className="text-[11px] font-label font-bold tracking-widest text-primary uppercase">
            Active Retrieval Unit
          </span>
          <span className="text-xs font-mono text-outline">
            {flipped ? 'Card Back (Solution)' : 'Card Front (Query)'}
          </span>
        </div>

        {/* Card Question / Answer View */}
        <div className="py-6 flex flex-col justify-center flex-1">
          <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl text-on-surface font-normal leading-snug">
            {card.question}
          </h2>

          {flipped && (
            <div className="mt-8 pt-8 border-t border-outline-variant/30 animate-fade-in">
              <span className="text-[10px] font-label font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 block mb-2">
                Conceptual Answer & Mental Anchor
              </span>
              <p className="font-body text-base sm:text-lg text-on-surface leading-relaxed">
                {card.answer}
              </p>
            </div>
          )}
        </div>

        {/* Flip Action Button */}
        <div className="pt-4 border-t border-outline-variant/20 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            aria-label={flipped ? 'Show question' : 'Show answer'}
            className="px-5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label text-xs font-semibold transition-all cursor-pointer shadow-xs flex items-center gap-2"
          >
            <RotateCcw size={14} />
            <span>{flipped ? 'Hide Answer' : 'Show Answer'}</span>
          </button>
          <span className="text-xs text-outline font-label">
            Press <kbd className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface font-semibold text-[11px]">Space</kbd> to flip
          </span>
        </div>
      </article>

      {error && <p className="text-xs text-error font-medium text-center p-2 rounded-lg bg-error-container">{error}</p>}

      {/* Cognitive Recall Grading Matrix */}
      <section className="w-full flex flex-col gap-3">
        <div className="flex items-center justify-between px-2 text-xs font-label text-on-surface-variant">
          <span className="font-semibold uppercase tracking-wider text-[11px]">
            Cognitive Recall Feedback (FSRS-4.5)
          </span>
          <span className="text-outline text-[11px]">Press keys 1 · 2 · 3 · 4</span>
        </div>

        <div
          className={`grid grid-cols-2 sm:grid-cols-4 gap-3 transition-all duration-300 ${
            flipped ? 'opacity-100' : 'opacity-30 pointer-events-none'
          }`}
          aria-hidden={!flipped}
        >
          {RATINGS.map((r) => {
            const intervalLabel = formatInterval(card.intervals?.[r.value]) || r.intervalFallback;
            return (
              <button
                key={r.value}
                type="button"
                onClick={() => rate(r.value)}
                disabled={submit.isPending}
                aria-label={`${r.label} - ${intervalLabel}`}
                className={`group flex flex-col items-center justify-between p-4 rounded-2xl transition-all shadow-xs active:scale-[0.98] cursor-pointer text-center ${r.btnClass}`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-label font-bold bg-surface-container text-on-surface-variant">
                    {r.key}
                  </span>
                  <span className={`text-[10px] font-label uppercase tracking-widest font-bold ${r.colorText}`}>
                    {intervalLabel}
                  </span>
                </div>
                <div className="my-2 flex flex-col items-center">
                  <span className="font-headline text-lg font-bold text-on-surface">{r.label}</span>
                  <span className="text-[11px] font-label text-on-surface-variant">{r.subtext}</span>
                </div>
                <span className="text-[10px] font-label text-outline">{r.desc}</span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};

const Review = () => {
  const [searchParams] = useSearchParams();
  const documentId = searchParams.get('document') || undefined;
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useReviewQueue(documentId);
  const [session, setSession] = useState(0);

  const restart = async () => {
    await queryClient.refetchQueries({ queryKey: ['review'] });
    setSession((n) => n + 1);
  };

  return (
    <div className="py-6 space-y-6 animate-fade-in font-body">
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center justify-center p-3.5 bg-primary-fixed rounded-2xl text-primary mb-3 shadow-xs">
          <Brain size={28} />
        </div>
        <h1 className="font-headline text-3xl sm:text-4xl font-normal text-on-surface tracking-tight">
          Spaced Review Arena
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5 leading-relaxed">
          Algorithmic memory stabilization: grade your cognitive recall certainty and cards reschedule immediately prior to mathematical forget intervals.
        </p>
        {data && (
          <p className="mt-2 text-xs font-label text-primary font-semibold">
            {data.counts.due} due · {data.counts.new} new today ({data.counts.newToday}/{data.counts.newLimit} started)
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant gap-2">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="font-headline text-base">Gathering due flashcards...</p>
        </div>
      ) : isError ? (
        <p className="text-center text-xs text-error font-medium p-3 rounded-xl bg-error-container max-w-md mx-auto">
          {getErrorMessage(error)}
        </p>
      ) : data.cards.length === 0 ? (
        <div className="bg-surface-container-low rounded-3xl p-10 text-center border border-outline-variant/30 max-w-xl mx-auto shadow-sm">
          <Sparkles className="mx-auto text-primary mb-3" size={36} />
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-1.5">All caught up!</h2>
          <p className="text-xs text-on-surface-variant mb-6 leading-relaxed max-w-md mx-auto">
            {data.counts.newWaiting > 0
              ? "You've completed today's scheduled new card quota. More cards unlock tomorrow."
              : 'No cards currently due for repetition. Generate new decks from your document library to expand your recall queue.'}
          </p>
          <Link
            to="/flashcards"
            className="inline-block px-5 py-2.5 rounded-xl bg-primary text-on-primary font-label text-xs font-semibold shadow-sm hover:bg-primary/95 transition-all"
          >
            Open Flashcard Vault
          </Link>
        </div>
      ) : (
        <ReviewSession key={session} initialCards={data.cards} onFinished={restart} />
      )}
    </div>
  );
};

export default Review;
