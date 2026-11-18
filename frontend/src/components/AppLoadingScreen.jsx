import React, { useEffect, useState } from 'react';
import { RefreshCw, Sparkles, BookOpen, Brain, Zap, Clock } from 'lucide-react';

const STUDY_INSIGHTS = [
  {
    icon: Brain,
    category: 'Active Recall',
    fact: 'Retrieval practice is up to 150% more effective for long-term retention than re-reading notes or passive highlighting.',
  },
  {
    icon: Clock,
    category: 'Spaced Repetition',
    fact: 'Hermann Ebbinghaus proved 70% of new information is forgotten within 24 hours without timed spaced retrieval.',
  },
  {
    icon: Sparkles,
    category: 'Neuroscience',
    fact: 'Every time you successfully recall an answer, your brain rebuilds and thickens that neural synaptic pathway.',
  },
  {
    icon: Zap,
    category: 'FSRS Algorithm',
    fact: 'Free Spaced Repetition Scheduler tracks memory stability and difficulty to compute mathematically optimal review intervals.',
  },
  {
    icon: BookOpen,
    category: 'Interleaving',
    fact: 'Alternating between related concepts trains your brain to discriminate patterns faster during high-stakes exams.',
  },
];

/**
 * Sahara Warm themed full-page loading screen.
 * Displays brand identity, engaging cognitive science facts,
 * and a graceful refresh callout if loading exceeds a few seconds.
 */
const AppLoadingScreen = ({ message = 'Preparing your learning space...' }) => {
  const [insightIndex, setInsightIndex] = useState(0);
  const [showRefreshPrompt, setShowRefreshPrompt] = useState(false);

  // Rotate interesting study insights every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setInsightIndex((prev) => (prev + 1) % STUDY_INSIGHTS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // If loading takes more than 3.5s (e.g. backend cold start or network delay),
  // proactively show the user a friendly explanation and refresh action.
  useEffect(() => {
    const promptTimer = setTimeout(() => {
      setShowRefreshPrompt(true);
    }, 3500);
    return () => clearTimeout(promptTimer);
  }, []);

  const currentInsight = STUDY_INSIGHTS[insightIndex];
  const InsightIcon = currentInsight.icon;

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-on-surface p-4 sm:p-6 font-body transition-colors relative overflow-hidden select-none">
      {/* Ambient Sahara Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-primary-container/10 blur-3xl pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative z-10 w-full max-w-md p-8 sm:p-10 rounded-3xl bg-surface-container-low/90 backdrop-blur-xl border border-outline-variant/30 shadow-[0_12px_40px_rgba(194,101,42,0.08)] flex flex-col items-center text-center animate-fade-in">
        {/* Soft Accent Trim Top Line */}
        <div className="absolute top-0 left-10 right-10 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full opacity-70" />

        {/* Animated Brand Emblem & Dual-Ring Loader */}
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-fixed to-primary/20 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_24px_rgba(194,101,42,0.22)]">
            <span className="material-symbols-outlined text-[32px] animate-pulse">local_library</span>
          </div>
          {/* Smooth spinning orbital arc */}
          <div className="absolute -inset-2.5 border-2 border-primary/20 border-t-primary rounded-3xl animate-spin duration-1000" />
        </div>

        {/* Brand Typography */}
        <h1 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight text-on-surface leading-tight">
          StudyTantra
        </h1>
        <p className="text-[10px] font-label font-bold uppercase tracking-widest text-primary mt-1 mb-6">
          AI Spaced Recall & Neural Intelligence
        </p>

        {/* Dynamic Interesting Cognitive Fact Card */}
        <div className="w-full bg-surface-container rounded-2xl p-4 border border-outline-variant/20 shadow-xs text-left mb-6 transition-all duration-300">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1 rounded-md bg-primary-fixed text-primary flex items-center justify-center">
              <InsightIcon size={13} />
            </span>
            <span className="text-[10px] font-label font-bold uppercase tracking-wider text-primary">
              {currentInsight.category} Insight
            </span>
          </div>
          <p className="text-xs text-on-surface leading-relaxed font-body">
            "{currentInsight.fact}"
          </p>
        </div>

        {/* Current Status Indicator */}
        <div className="flex items-center gap-2 text-xs text-on-surface-variant font-label mb-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
          <span>{message}</span>
        </div>

        {/* Minimal Progress Track */}
        <div className="w-40 h-1 rounded-full bg-surface-container-highest overflow-hidden mb-4">
          <div className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full animate-pulse w-3/4" />
        </div>

        {/* Graceful Refresh Callout (Reveals if loading is taking time) */}
        {showRefreshPrompt ? (
          <div className="mt-2 pt-4 border-t border-outline-variant/20 w-full animate-slide-up flex flex-col items-center gap-3">
            <p className="text-xs text-on-surface-variant font-body leading-relaxed">
              Taking longer than expected? The study engine may be waking up.
            </p>
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label text-xs font-bold shadow-md hover:shadow-lg transition-all duration-150 transform active:scale-95 cursor-pointer"
            >
              <RefreshCw size={14} className="shrink-0" />
              <span>Refresh Page</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleRefresh}
            className="text-[11px] text-outline hover:text-primary transition-colors cursor-pointer mt-1"
          >
            Taking too long? <span className="underline font-semibold">Click to refresh</span>
          </button>
        )}
      </div>

      {/* Footer subtle brand tagline */}
      <p className="mt-6 text-[11px] font-label text-on-surface-variant/70 tracking-wider uppercase">
        Engineered for deep recall & cognitive mastery
      </p>
    </div>
  );
};

export default AppLoadingScreen;
