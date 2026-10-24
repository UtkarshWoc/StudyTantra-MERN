import React, { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Loader2, RotateCcw, CheckCircle2, Brain, Sparkles } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useReviewQueue, useSubmitReview } from '../api/hooks';
import { formatInterval } from '../lib/time';
import { getErrorMessage } from '../lib/api';

const RATINGS = [
  { value: 1, label: 'Again', key: '1', className: 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/30' },
  { value: 2, label: 'Hard', key: '2', className: 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/30' },
  { value: 3, label: 'Good', key: '3', className: 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/30' },
  { value: 4, label: 'Easy', key: '4', className: 'bg-sky-500/10 text-sky-500 hover:bg-sky-500/20 border-sky-500/30' },
];

/**
 * Spaced-repetition session. The queue is fetched once per session; "Again"
 * cards come back later in the same session, as in Anki.
 */
const ReviewSession = ({ initialCards, onFinished }) => {
  const [queue, setQueue] = useState(initialCards);
  const [flipped, setFlipped] = useState(false);
  const [stats, setStats] = useState({ reviewed: 0, again: 0 });
  const [error, setError] = useState('');
  const submit = useSubmitReview();
  const card = queue[0];

  const rate = useCallback((rating) => {
    if (!card || !flipped || submit.isPending) return;
    setError('');
    submit.mutate({ id: card._id, rating }, {
      onSuccess: () => {
        setStats((s) => ({ reviewed: s.reviewed + 1, again: s.again + (rating === 1 ? 1 : 0) }));
        setFlipped(false);
        // Missed cards are shown again near the end of this session
        setQueue((q) => (rating === 1 ? [...q.slice(1), { ...q[0], isNew: false }] : q.slice(1)));
      },
      onError: (err) => setError(getErrorMessage(err, 'Could not save that review.')),
    });
  }, [card, flipped, submit]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest('input, textarea, select')) return;
      // A focused button already turns Space into a click; handling it too would flip twice
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
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-10 text-center border border-gray-100 dark:border-gray-700 max-w-xl mx-auto">
        <CheckCircle2 className="mx-auto text-emerald-500 mb-4" size={48} />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Session complete</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          You reviewed {stats.reviewed} card{stats.reviewed === 1 ? '' : 's'}{stats.again ? `, and repeated ${stats.again} you missed` : ''}. Come back when more are due.
        </p>
        <div className="flex justify-center gap-3">
          <button onClick={onFinished} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-[#0b1120] font-bold hover:bg-amber-600 cursor-pointer"><RotateCcw size={16} /> Check for more</button>
          <Link to="/dashboard" className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 font-semibold text-gray-600 dark:text-gray-300">Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="flex items-center justify-between mb-4 text-sm">
        <span className="font-semibold text-gray-500 dark:text-gray-400">{queue.length} left · {stats.reviewed} done</span>
        <span className="flex items-center gap-2">
          {card.isNew && <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-sky-500/15 text-sky-500">New</span>}
          <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-amber-500/15 text-amber-500 uppercase tracking-wide">{card.topic}</span>
        </span>
      </div>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-label={flipped ? 'Show question' : 'Show answer'}
        className="w-full min-h-[280px] rounded-3xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl p-8 md:p-12 flex flex-col items-center justify-center text-center cursor-pointer"
      >
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">{card.documentTitle}</p>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight">{card.question}</h2>
        {flipped ? (
          <p className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 w-full text-lg md:text-xl text-gray-700 dark:text-gray-200 leading-relaxed">{card.answer}</p>
        ) : (
          <p className="mt-8 text-sm text-gray-400">Click or press <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-xs">Space</kbd> to reveal</p>
        )}
      </button>

      {error && <p className="text-sm text-red-500 mt-3 text-center">{error}</p>}

      <div className={`grid grid-cols-4 gap-2 mt-6 transition-opacity ${flipped ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} aria-hidden={!flipped}>
        {RATINGS.map((r) => (
          <button
            key={r.value}
            type="button"
            onClick={() => rate(r.value)}
            disabled={submit.isPending}
            className={`flex flex-col items-center py-3 rounded-2xl border font-bold disabled:opacity-50 cursor-pointer ${r.className}`}
          >
            <span>{r.label}</span>
            <span className="text-[11px] font-semibold opacity-80">{formatInterval(card.intervals[r.value])} · {r.key}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const Review = () => {
  const [searchParams] = useSearchParams();
  const documentId = searchParams.get('document') || undefined;
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useReviewQueue(documentId);
  // A session keeps its own queue; background refetches must not reset it.
  // Only "Check for more" starts a new session with fresh data.
  const [session, setSession] = useState(0);

  const restart = async () => {
    await queryClient.refetchQueries({ queryKey: ['review'] });
    setSession((n) => n + 1);
  };

  return (
    <div className="py-6 space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-4 bg-amber-500/10 rounded-2xl text-amber-500 mb-4"><Brain size={32} /></div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Review</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-lg mx-auto">
          Spaced repetition: rate how well you remembered and each card comes back right before you'd forget it.
        </p>
        {data && (
          <p className="mt-3 text-sm text-gray-400">
            {data.counts.due} due · {data.counts.new} new today ({data.counts.newToday}/{data.counts.newLimit} new cards started)
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16 text-gray-400"><Loader2 className="animate-spin" size={32} /></div>
      ) : isError ? (
        <p className="text-center text-red-500">{getErrorMessage(error)}</p>
      ) : data.cards.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-10 text-center border border-gray-100 dark:border-gray-700 max-w-xl mx-auto">
          <Sparkles className="mx-auto text-amber-500 mb-4" size={40} />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">All caught up</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {data.counts.newWaiting > 0 ? "You've started today's new cards. More unlock tomorrow (change the limit in Settings)." : 'No cards are due. Generate flashcards from a document to start.'}
          </p>
          <Link to="/flashcards" className="inline-block px-5 py-2.5 rounded-xl bg-amber-500 text-[#0b1120] font-bold">Go to flashcards</Link>
        </div>
      ) : (
        <ReviewSession key={session} initialCards={data.cards} onFinished={restart} />
      )}
    </div>
  );
};

export default Review;
