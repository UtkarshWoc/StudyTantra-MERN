import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Folder,
  Layers,
  Sparkles,
  Target,
  FileText,
  Brain,
  MessageSquare,
  Upload,
  Zap,
} from 'lucide-react';
import { useDashboard, useInsights, useTogglePlanTask } from '../api/hooks';
import { useAuth } from '../context/auth';
import ActivityHeatmap from '../components/ActivityHeatmap';
import GoalMeter from '../components/GoalMeter';
import { timeAgo } from '../lib/time';
import { taskLink } from '../lib/tasks';

const ACTIVITY = {
  review: { icon: Brain, text: (a) => `Reviewed a card${a.meta?.topic ? ` on ${a.meta.topic}` : ''}` },
  quiz: { icon: Target, text: (a) => `Scored ${a.meta?.score ?? 0}/${a.meta?.total ?? 0} on a quiz` },
  upload: { icon: Upload, text: () => 'Uploaded a document' },
  chat: { icon: MessageSquare, text: () => 'Asked the AI assistant' },
  generate: { icon: Zap, text: (a) => `Generated ${a.meta?.count ?? ''} ${a.meta?.kind === 'quiz' ? 'quiz questions' : 'flashcards'}` },
};

const TodaysPlan = ({ plan }) => {
  const toggle = useTogglePlanTask(plan?.planId);
  if (!plan) {
    return (
      <div className="p-4 rounded-xl bg-surface-container-low text-xs text-on-surface-variant font-body">
        Have an exam coming up?{' '}
        <Link to="/planner" className="font-semibold text-primary hover:underline">
          Create an exam study plan
        </Link>{' '}
        and your scheduled milestones appear here.
      </div>
    );
  }
  if (!plan.tasks || !plan.tasks.length) {
    return (
      <div className="p-4 rounded-xl bg-surface-container-low text-xs text-on-surface-variant">
        No pending tasks today for <strong className="text-on-surface">{plan.title}</strong>. Optimal consolidation day!
      </div>
    );
  }
  return (
    <ul className="space-y-2.5">
      {plan.tasks.map((task) => (
        <li
          key={task._id}
          className="flex items-start gap-3 p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors group"
        >
          <input
            type="checkbox"
            checked={task.done}
            onChange={(e) => toggle.mutate({ taskId: task._id, done: e.target.checked })}
            aria-label={`Mark "${task.title}" done`}
            className="mt-0.5 accent-primary w-4 h-4 rounded cursor-pointer"
          />
          <Link
            to={taskLink(task)}
            className={`flex-1 text-xs font-body transition-colors ${
              task.done ? 'line-through text-outline' : 'text-on-surface hover:text-primary'
            }`}
          >
            <span className="font-semibold">{task.title}</span>{' '}
            <span className="text-[11px] text-on-surface-variant">· {task.minutes} min</span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: library } = useDashboard();
  const { data: insights, isLoading, isError } = useInsights();

  // Simple countdown ticker for upcoming milestone
  const [countdown, setCountdown] = useState({ days: 9, hours: 14, mins: 22, secs: 45 });
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="font-headline text-lg text-on-surface">Loading academic workspace...</p>
        <span className="text-xs font-label text-on-surface-variant">Aligning memory recall weights</span>
      </div>
    );
  }

  if (isError || !insights) {
    return (
      <div className="text-center py-20 bg-surface-container-low rounded-2xl p-8 max-w-lg mx-auto mt-10">
        <span className="material-symbols-outlined text-tertiary text-4xl mb-2">error</span>
        <h2 className="font-headline text-2xl text-on-surface">Could not load dashboard</h2>
        <p className="text-xs text-on-surface-variant mt-2 mb-6">Please check your network connection and reload.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-primary/90 transition-colors"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  const metrics = library?.metrics || {};
  const dueTotal = (insights.due?.reviews || 0) + (insights.due?.new || 0);
  const streak = insights.streak?.current || 14;
  const userName = user?.name || 'Arya Sharma';
  const firstName = userName.split(' ')[0] || 'Arya';

  return (
    <div className="flex flex-col gap-8 md:gap-10 pb-12 animate-fade-in">
      {/* ─── Section 1: Editorial Welcome & Daily Momentum Banner ─── */}
      <section className="relative overflow-hidden rounded-2xl bg-surface-container-low shadow-sm p-6 sm:p-8 md:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 border border-outline-variant/30">
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-primary-fixed/30 blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-20 w-64 h-64 rounded-full bg-secondary-fixed/40 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase font-label bg-primary-fixed text-on-primary-fixed-variant shadow-xs">
              Session Wave #2 • FSRS v4.5 Optimized
            </span>
            <span className="text-xs font-medium text-on-surface-variant font-label flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_fire_department
              </span>
              Day {streak} on Track
            </span>
          </div>

          <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-on-surface leading-[1.15]">
            Welcome back, {firstName}.
          </h1>
          <p className="font-body text-sm sm:text-base text-on-surface-variant mt-3 leading-relaxed">
            You have <strong className="text-on-surface font-semibold">{dueTotal} cards due today</strong> across your active decks.
            Upcoming milestone: <span className="text-primary font-semibold">CS-402 DBMS Final</span> in {countdown.days} days.
          </p>

          {/* Metric Badges Row */}
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/20">
              <span className="material-symbols-outlined text-primary text-[20px]">psychology</span>
              <div className="flex flex-col">
                <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Retention Rate</span>
                <span className="text-xs font-semibold text-on-surface font-label">
                  91.4% <span className="text-[10px] font-normal text-primary">↑ 1.2%</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/20">
              <span className="material-symbols-outlined text-tertiary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                bolt
              </span>
              <div className="flex flex-col">
                <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Current Streak</span>
                <span className="text-xs font-semibold text-on-surface font-label">{streak} Consecutive Days</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/20">
              <span className="material-symbols-outlined text-secondary text-[20px]">network_intelligence</span>
              <div className="flex flex-col">
                <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Target Stability</span>
                <span className="text-xs font-semibold text-on-surface font-label">90% FSRS v4.5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action CTA */}
        <div className="relative z-10 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-center gap-3 shrink-0">
          <Link
            to="/review"
            className="group relative inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-xl bg-primary text-on-primary font-label font-semibold text-xs tracking-wide transition-all duration-200 hover:bg-primary/95 shadow-[0_4px_20px_rgba(194,101,42,0.28)] hover:shadow-[0_6px_26px_rgba(194,101,42,0.36)] hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>{dueTotal > 0 ? `Start Daily Review (${dueTotal} Cards)` : 'Practice Flashcard Vault'}</span>
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </Link>
          <span className="text-[11px] text-on-surface-variant font-label tracking-wide flex items-center gap-1.5 self-center lg:self-end">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
            Est. completion: {Math.max(5, Math.round(dueTotal * 0.4))} mins
          </span>
        </div>
      </section>

      {/* ─── Section 2: Bento Grid (Active Spaced Queue & Exam Countdown) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Active Spaced Review Queue (8 Cols) */}
        <section className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline text-2xl md:text-3xl text-on-surface font-normal">
                Active Spaced Review Queue
              </h2>
              <p className="font-body text-xs text-on-surface-variant mt-0.5">
                Calculated by recall memory decay coefficient and optimal test intervals
              </p>
            </div>
            <span className="text-[11px] font-label uppercase tracking-wider text-on-surface-variant px-3 py-1 rounded-full bg-surface-container">
              3 Decks Pending
            </span>
          </div>

          <div className="flex flex-col gap-3.5">
            {/* Deck 1: CS-402 */}
            <div className="group relative rounded-xl bg-surface-container-low p-5 sm:p-6 transition-all duration-200 hover:shadow-md hover:bg-surface-container flex flex-col md:flex-row md:items-center justify-between gap-5 border border-outline-variant/30">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">database</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-label font-bold text-primary tracking-wide">CS-402</span>
                    <span className="text-xs text-on-surface-variant font-label">• 18 Cards Due</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-tertiary-fixed text-on-tertiary-fixed">
                      High Urgency
                    </span>
                  </div>
                  <h3 className="font-headline text-xl text-on-surface mt-1 font-semibold leading-tight">
                    Database Management Systems
                  </h3>
                  <p className="text-xs text-on-surface-variant font-body mt-1">
                    Focus modules: Concurrency Control, Two-Phase Locking, B+ Tree Indexing
                  </p>
                  <div className="flex items-center gap-3 mt-3 w-48 max-w-full">
                    <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: '72%' }} />
                    </div>
                    <span className="text-[11px] font-label text-on-surface-variant shrink-0">72% Mastered</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  onClick={() => navigate('/review')}
                  className="px-4 py-2 rounded-lg bg-primary text-on-primary font-label text-xs font-semibold hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                  type="button"
                >
                  <span>Review Now</span>
                  <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                </button>
              </div>
            </div>

            {/* Deck 2: MATH-301 */}
            <div className="group relative rounded-xl bg-surface-container-low p-5 sm:p-6 transition-all duration-200 hover:shadow-md hover:bg-surface-container flex flex-col md:flex-row md:items-center justify-between gap-5 border border-outline-variant/30">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shrink-0 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">functions</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-label font-bold text-secondary tracking-wide">MATH-301</span>
                    <span className="text-xs text-on-surface-variant font-label">• 12 Cards Due</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface-container-highest text-on-surface-variant">
                      Scheduled
                    </span>
                  </div>
                  <h3 className="font-headline text-xl text-on-surface mt-1 font-semibold leading-tight">
                    Advanced Linear Algebra
                  </h3>
                  <p className="text-xs text-on-surface-variant font-body mt-1">
                    Focus modules: Singular Value Decomposition, Spectral Theorem & Gram-Schmidt
                  </p>
                  <div className="flex items-center gap-3 mt-3 w-48 max-w-full">
                    <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: '88%' }} />
                    </div>
                    <span className="text-[11px] font-label text-on-surface-variant shrink-0">88% Mastered</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  onClick={() => navigate('/review')}
                  className="px-4 py-2 rounded-lg bg-surface-container-highest text-on-surface font-label text-xs font-semibold hover:bg-primary hover:text-on-primary transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                  type="button"
                >
                  <span>Review Now</span>
                  <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                </button>
              </div>
            </div>

            {/* Deck 3: BIO-210 */}
            <div className="group relative rounded-xl bg-surface-container-low p-5 sm:p-6 transition-all duration-200 hover:shadow-md hover:bg-surface-container flex flex-col md:flex-row md:items-center justify-between gap-5 border border-outline-variant/30">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary shrink-0 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">biotech</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-label font-bold text-tertiary tracking-wide">BIO-210</span>
                    <span className="text-xs text-on-surface-variant font-label">• 8 Cards Due</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface-container-highest text-on-surface-variant">
                      Maintenance
                    </span>
                  </div>
                  <h3 className="font-headline text-xl text-on-surface mt-1 font-semibold leading-tight">
                    Molecular Cell Biology
                  </h3>
                  <p className="text-xs text-on-surface-variant font-body mt-1">
                    Focus modules: Citric Acid Cycle, G-Protein Signaling Pathways, ATP Synthase
                  </p>
                  <div className="flex items-center gap-3 mt-3 w-48 max-w-full">
                    <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: '93%' }} />
                    </div>
                    <span className="text-[11px] font-label text-on-surface-variant shrink-0">93% Mastered</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  onClick={() => navigate('/review')}
                  className="px-4 py-2 rounded-lg bg-surface-container-highest text-on-surface font-label text-xs font-semibold hover:bg-primary hover:text-on-primary transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                  type="button"
                >
                  <span>Review Now</span>
                  <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Exam Countdown & Target Bento (4 Cols) */}
        <section className="lg:col-span-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-headline text-2xl md:text-3xl text-on-surface font-normal">
              Exam Countdown
            </h2>
            <span className="text-xs font-label text-primary font-semibold">Priority 1</span>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-surface-container-low p-6 flex flex-col gap-6 shadow-sm border border-outline-variant/30">
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-primary/10 blur-xl pointer-events-none" />

            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-label font-bold uppercase tracking-wider bg-tertiary-fixed text-on-tertiary-fixed">
                High Priority Flag
              </span>
              <span className="text-xs font-label text-on-surface-variant">May 24, 09:00 AM</span>
            </div>

            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-primary font-label">
                Main Arena
              </span>
              <h3 className="font-headline text-2xl text-on-surface font-normal mt-0.5">
                CS-402 Final Examination
              </h3>
              <p className="text-xs text-on-surface-variant mt-1">Hall B3 • Engineering Complex</p>
            </div>

            {/* Digital Countdown Blocks */}
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-surface-container-lowest rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-xs border border-outline-variant/20">
                <span className="font-headline text-2xl font-bold text-on-surface">{String(countdown.days).padStart(2, '0')}</span>
                <span className="text-[10px] font-label text-on-surface-variant uppercase tracking-wider">Days</span>
              </div>
              <div className="bg-surface-container-lowest rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-xs border border-outline-variant/20">
                <span className="font-headline text-2xl font-bold text-on-surface">{String(countdown.hours).padStart(2, '0')}</span>
                <span className="text-[10px] font-label text-on-surface-variant uppercase tracking-wider">Hours</span>
              </div>
              <div className="bg-surface-container-lowest rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-xs border border-outline-variant/20">
                <span className="font-headline text-2xl font-bold text-on-surface">{String(countdown.mins).padStart(2, '0')}</span>
                <span className="text-[10px] font-label text-on-surface-variant uppercase tracking-wider">Mins</span>
              </div>
              <div className="bg-surface-container-lowest rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-xs border border-outline-variant/20">
                <span className="font-headline text-2xl font-bold text-primary">{String(countdown.secs).padStart(2, '0')}</span>
                <span className="text-[10px] font-label text-on-surface-variant uppercase tracking-wider">Secs</span>
              </div>
            </div>

            {/* Target Coverage Checklist */}
            <div className="flex flex-col gap-2 pt-1">
              <span className="text-[11px] font-label uppercase tracking-wider font-semibold text-on-surface-variant">
                Target Coverage Required:
              </span>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs font-body text-on-surface bg-surface-container-lowest px-3 py-2 rounded-lg border border-outline-variant/20">
                  <span className="truncate">Crash Recovery & Write-Ahead Logs</span>
                  <span className="text-tertiary font-semibold shrink-0">64%</span>
                </div>
                <div className="flex items-center justify-between text-xs font-body text-on-surface bg-surface-container-lowest px-3 py-2 rounded-lg border border-outline-variant/20">
                  <span className="truncate">Distributed Commit Protocols (2PC)</span>
                  <span className="text-primary font-semibold shrink-0">79%</span>
                </div>
                <div className="flex items-center justify-between text-xs font-body text-on-surface bg-surface-container-lowest px-3 py-2 rounded-lg border border-outline-variant/20">
                  <span className="truncate">Serializability & Graph Testing</span>
                  <span className="text-on-surface font-semibold shrink-0">94%</span>
                </div>
              </div>
            </div>

            <Link
              to="/quizzes"
              className="w-full text-center py-2.5 rounded-lg bg-surface-container-highest text-on-surface hover:bg-primary hover:text-on-primary text-xs font-label font-semibold transition-all shadow-xs"
            >
              Generate Focused Mock Test →
            </Link>
          </div>
        </section>
      </div>

      {/* ─── Section 3: Cognitive Retention & Memory Curve Analytics ─── */}
      <section className="rounded-2xl bg-surface-container-low p-6 sm:p-8 md:p-10 shadow-sm flex flex-col gap-6 border border-outline-variant/30">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-label uppercase tracking-widest text-primary font-semibold">
              Ebbinghaus vs Active Retrieval
            </span>
            <h2 className="font-headline text-2xl md:text-3xl text-on-surface font-normal mt-1">
              Cognitive Retention & Stability Trajectory
            </h2>
            <p className="font-body text-xs sm:text-sm text-on-surface-variant mt-1">
              Mathematical decay projection according to the Free Spaced Repetition Scheduler algorithm
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-label">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-primary" />
              <span className="text-on-surface">Active Recall Resets</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-outline" style={{ borderTop: '2px dashed' }} />
              <span className="text-on-surface-variant">Natural Decay</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Scaled Inline Vector Retention Graph */}
          <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-5 sm:p-6 shadow-sm flex flex-col gap-4 border border-outline-variant/20">
            <div className="flex items-center justify-between text-xs text-on-surface-variant font-label pb-2 border-b border-outline-variant/20">
              <span>Memory Retention (%)</span>
              <span>Elapsed Timeline (Days)</span>
            </div>

            <div className="relative w-full h-56 sm:h-64">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 600 220">
                {/* Horizontal grid lines */}
                <line x1="0" x2="600" y1="20" y2="20" stroke="currentColor" strokeDasharray="4" className="text-outline-variant/40" />
                <line x1="0" x2="600" y1="70" y2="70" stroke="currentColor" strokeDasharray="4" className="text-outline-variant/40" />
                <line x1="0" x2="600" y1="120" y2="120" stroke="currentColor" strokeDasharray="4" className="text-outline-variant/40" />
                <line x1="0" x2="600" y1="170" y2="170" stroke="currentColor" strokeDasharray="4" className="text-outline-variant/40" />

                {/* Passive Forgetting Decay Curve */}
                <path d="M 0,20 Q 80,140 200,180 T 600,210" fill="none" stroke="currentColor" strokeDasharray="6 4" strokeWidth="2" opacity="0.4" className="text-outline" />

                {/* Active Recall Wave 1 */}
                <path d="M 0,20 C 30,50 60,95 80,105" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary" />
                <line x1="80" x2="80" y1="105" y2="24" stroke="currentColor" strokeDasharray="2 2" strokeWidth="2" className="text-primary" />

                {/* Active Recall Wave 2 */}
                <path d="M 80,24 C 130,55 170,85 200,92" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary" />
                <line x1="200" x2="200" y1="92" y2="22" stroke="currentColor" strokeDasharray="2 2" strokeWidth="2" className="text-primary" />

                {/* Active Recall Wave 3 */}
                <path d="M 200,22 C 280,45 360,65 420,70" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary" />
                <line x1="420" x2="420" y1="70" y2="21" stroke="currentColor" strokeDasharray="2 2" strokeWidth="2" className="text-primary" />

                {/* Final Wave 4 */}
                <path d="M 420,21 C 490,32 540,42 600,45" fill="none" stroke="currentColor" strokeWidth="3" className="text-primary" />

                {/* Dots */}
                <circle cx="80" cy="24" r="5" strokeWidth="2" className="fill-primary stroke-surface-container-lowest" />
                <circle cx="200" cy="22" r="5" strokeWidth="2" className="fill-primary stroke-surface-container-lowest" />
                <circle cx="420" cy="21" r="5" strokeWidth="2" className="fill-primary stroke-surface-container-lowest" />
                <circle cx="600" cy="45" r="5" strokeWidth="2" className="fill-primary stroke-surface-container-lowest" />

                {/* Callout flag */}
                <g transform="translate(380, 85)">
                  <rect width="130" height="42" rx="8" className="fill-surface-container shadow-sm" />
                  <text x="65" y="18" textAnchor="middle" className="fill-on-surface text-[11px] font-semibold font-label">
                    Day 14 Review
                  </text>
                  <text x="65" y="32" textAnchor="middle" className="fill-primary text-[10px] font-label font-bold">
                    Stability: 91.4%
                  </text>
                </g>
              </svg>
            </div>

            <div className="flex items-center justify-between text-[11px] text-on-surface-variant font-label pt-2">
              <span>Day 1 (Lecture)</span>
              <span>Day 3 (Wave 1)</span>
              <span>Day 7 (Wave 2)</span>
              <span>Day 14 (Current)</span>
              <span>Day 30 (Exam Ready)</span>
            </div>
          </div>

          {/* Weekly Summary & Output */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/20">
              <span className="text-[11px] font-label uppercase tracking-wider text-on-surface-variant font-semibold">
                Syllabus Absorption
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-headline text-4xl font-normal text-on-surface">84.2%</span>
                <span className="text-xs font-semibold text-primary font-label">+6.8% this week</span>
              </div>
              <div className="w-full bg-surface-container-high h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: '84.2%' }} />
              </div>
              <p className="text-xs text-on-surface-variant font-body mt-2.5 leading-relaxed">
                1,248 of 1,480 targeted academic concepts verified in long-term memory buffer.
              </p>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/20">
              <span className="text-[11px] font-label uppercase tracking-wider text-on-surface-variant font-semibold">
                Weekly Study Output
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-headline text-4xl font-normal text-on-surface">
                  18.5 <span className="text-lg">hrs</span>
                </span>
                <span className="text-xs font-semibold text-on-surface-variant font-label">Goal: 20 hrs</span>
              </div>

              {/* Daily Micro-bars */}
              <div className="flex items-end justify-between gap-2 h-14 mt-4 pt-1">
                {[
                  { day: 'M', height: '65%', active: false },
                  { day: 'T', height: '80%', active: false },
                  { day: 'W', height: '100%', active: true },
                  { day: 'T', height: '50%', active: false },
                  { day: 'F', height: '90%', active: false },
                  { day: 'S', height: '40%', active: false },
                  { day: 'S', height: '30%', active: false },
                ].map((b, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                    <div
                      className={`w-full rounded-t transition-all ${
                        b.active ? 'bg-primary' : 'bg-primary-fixed'
                      }`}
                      style={{ height: b.height }}
                    />
                    <span className={`text-[10px] font-label ${b.active ? 'font-bold text-primary' : 'text-on-surface-variant'}`}>
                      {b.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 4: Daily Goal & Streak & Plan Bento ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Goal Meter */}
        <section className="bg-surface-container-low rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-between" aria-label="Daily goal">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-label font-bold uppercase tracking-wider text-on-surface-variant">
                Daily Retention Goal
              </span>
              <span className="material-symbols-outlined text-primary text-[20px]">flag</span>
            </div>
            <GoalMeter done={insights.goal?.done || 18} target={insights.goal?.target || 20} />
          </div>
          <p className="text-[11px] text-on-surface-variant mt-4 font-label">
            Target cards reviewed daily. Change in{' '}
            <Link to="/settings" className="text-primary font-semibold hover:underline">
              Settings
            </Link>.
          </p>
        </section>

        {/* Today's Tasks */}
        <section className="bg-surface-container-low rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-label font-bold uppercase tracking-wider text-on-surface-variant">
                Today's Plan
              </span>
              <span className="material-symbols-outlined text-primary text-[20px]">checklist</span>
            </div>
            <TodaysPlan plan={insights.todaysPlan} />
          </div>
          <Link to="/planner" className="text-[11px] font-semibold text-primary hover:underline mt-3 inline-block">
            View full syllabus planner →
          </Link>
        </section>

        {/* Weak Topics */}
        <section className="bg-surface-container-low rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-between md:col-span-2 lg:col-span-1">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-label font-bold uppercase tracking-wider text-on-surface-variant">
                Priority Weak Topics
              </span>
              <span className="material-symbols-outlined text-tertiary text-[20px]">warning</span>
            </div>
            {!insights.weakTopics || insights.weakTopics.length === 0 ? (
              <p className="text-xs text-on-surface-variant">
                No acute weak spots detected. Retain regular review cadence!
              </p>
            ) : (
              <ul className="space-y-2">
                {insights.weakTopics.slice(0, 3).map((t) => (
                  <li
                    key={`${t.document}-${t.topic}`}
                    className="flex items-center justify-between p-2 rounded-lg bg-surface-container-lowest text-xs border border-outline-variant/20"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-semibold text-on-surface truncate">{t.topic}</p>
                      <p className="text-[10px] text-on-surface-variant truncate">
                        {t.accuracy}% retention ({t.total} attempts)
                      </p>
                    </div>
                    {t.documentTitle && (
                      <Link
                        to={`/quizzes?document=${t.document}&topic=${encodeURIComponent(t.topic)}`}
                        className="text-[11px] font-bold text-primary hover:underline shrink-0"
                      >
                        Drill →
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <span className="text-[10px] text-on-surface-variant font-label mt-3">
            Ranked by error frequency in quizzes and rating lapses
          </span>
        </section>
      </div>

      {/* ─── Section 5: Stats Overview Grid ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Documents Ingested', value: metrics.totalDocuments ?? 4, icon: Folder, symbol: 'folder_open' },
          { label: 'Flashcards Active', value: metrics.totalFlashcards ?? 142, icon: Layers, symbol: 'style' },
          { label: 'Quizzes Taken', value: metrics.totalQuizzes ?? 18, icon: Target, symbol: 'psychology' },
          { label: 'Average Score', value: `${metrics.averageScore ?? 88}%`, icon: Sparkles, symbol: 'verified' },
        ].map((m, i) => (
          <div
            key={m.label}
            className="p-5 rounded-2xl bg-surface-container-low shadow-sm border border-outline-variant/30 flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[20px]">{m.symbol}</span>
            </div>
            <div>
              <p className="text-[10px] font-bold font-label uppercase tracking-widest text-on-surface-variant">
                {m.label}
              </p>
              <p className="font-headline text-2xl font-bold text-on-surface leading-tight mt-0.5">
                {m.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Section 6: Annual Activity Heatmap & Recent Log ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Heatmap (8 Cols) */}
        <section className="lg:col-span-8 bg-surface-container-low rounded-2xl p-6 sm:p-8 shadow-sm border border-outline-variant/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-headline text-2xl text-on-surface font-semibold">
                Annual Study Activity Heatmap
              </h3>
              <p className="text-xs text-on-surface-variant font-body mt-0.5">
                Every review, quiz, and generated deck logged over time
              </p>
            </div>
            <span className="text-xs font-label text-primary font-bold">
              365-Day Trajectory
            </span>
          </div>
          <ActivityHeatmap days={insights.heatmap} />
        </section>

        {/* Recent Activity Feed (4 Cols) */}
        <section className="lg:col-span-4 bg-surface-container-low rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-3">
          <h3 className="font-headline text-xl text-on-surface font-semibold">
            Recent Activity Feed
          </h3>

          {!insights.recentActivity || insights.recentActivity.length === 0 ? (
            <div className="text-center py-8 text-on-surface-variant text-xs">
              No recent study logs recorded.{' '}
              <Link to="/documents" className="text-primary font-semibold underline">
                Upload a document
              </Link>{' '}
              to begin.
            </div>
          ) : (
            <ul className="divide-y divide-outline-variant/20">
              {insights.recentActivity.slice(0, 5).map((a) => {
                const kind = ACTIVITY[a.type] || { icon: FileText, text: () => a.type };
                return (
                  <li key={a._id} className="py-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
                      <kind.icon size={15} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-on-surface truncate">{kind.text(a)}</p>
                      {a.documentTitle && (
                        <Link
                          to={`/documents/${a.document}`}
                          className="text-[11px] text-on-surface-variant hover:text-primary truncate block transition-colors"
                        >
                          {a.documentTitle}
                        </Link>
                      )}
                    </div>
                    <span className="text-[10px] text-outline whitespace-nowrap font-label">
                      {timeAgo(a.createdAt)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
