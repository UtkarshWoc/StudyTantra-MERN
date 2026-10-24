import React from 'react';
import { Link } from 'react-router-dom';
import { Folder, Layers, Sparkles, Target, Loader2, FileText, Flame, Brain, AlertTriangle, CalendarCheck, MessageSquare, Upload, Zap, ArrowRight, TrendingUp } from 'lucide-react';
import { useDashboard, useInsights, useTogglePlanTask } from '../api/hooks';
import ActivityHeatmap from '../components/ActivityHeatmap';
import GoalMeter from '../components/GoalMeter';
import { timeAgo } from '../lib/time';
import { taskLink } from '../lib/tasks';

const card = 'glass-card rounded-2xl p-5';

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
      <p className="text-sm text-slate-400">
        Have an exam coming up? <Link to="/planner" className="font-semibold text-amber-400 hover:text-amber-300 link-underline">Create a study plan</Link> and your daily tasks show up here.
      </p>
    );
  }
  if (!plan.tasks.length) return <p className="text-sm text-slate-400">No tasks today for <span className="font-semibold text-slate-200">{plan.title}</span>. Enjoy the break!</p>;
  return (
    <ul className="space-y-2">
      {plan.tasks.map((task) => (
        <li key={task._id} className="flex items-start gap-3 group">
          <input
            type="checkbox"
            checked={task.done}
            onChange={(e) => toggle.mutate({ taskId: task._id, done: e.target.checked })}
            aria-label={`Mark "${task.title}" done`}
            className="mt-1 accent-amber-500 w-4 h-4 cursor-pointer"
          />
          <Link to={taskLink(task)} className={`flex-1 text-sm transition-colors duration-200 ${task.done ? 'line-through text-slate-600' : 'text-slate-300 hover:text-amber-300'}`}>
            {task.title} <span className="text-xs text-slate-600">· {task.minutes} min</span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

const StatCard = ({ label, value, icon, delay }) => {
  const Icon = icon;
  return (
    <div className="glass-card glass-card-hover rounded-2xl p-4 group" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/15 group-hover:shadow-lg group-hover:shadow-amber-500/10 transition-all duration-300">
          <Icon size={18} strokeWidth={1.8} />
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">{label}</p>
          <p className="text-xl font-extrabold text-white animate-fade-in">{value}</p>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { data: library } = useDashboard();
  const { data: insights, isLoading, isError } = useInsights();

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-500">
      <Loader2 className="animate-spin mb-4 text-amber-500" size={36} />
      <p className="font-medium">Loading overview...</p>
    </div>
  );
  if (isError) return (<div className="text-center py-16 text-slate-400">Could not load your dashboard. Please refresh.</div>);

  const metrics = library?.metrics || {};
  const dueTotal = insights.due.reviews + insights.due.new;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero: what to do right now */}
      <section className={`${card} gradient-border flex flex-col md:flex-row md:items-center gap-6 relative overflow-hidden`}>
        {/* Subtle glow behind the number */}
        <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-amber-500/[0.08] blur-[60px] pointer-events-none" />
        <div className="flex-1 relative">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">Ready to review</p>
          <p className="text-5xl font-extrabold text-white leading-none">{dueTotal}</p>
          <p className="text-sm text-slate-400 mt-2">{insights.due.reviews} due · {insights.due.new} new cards</p>
        </div>
        <Link
          to="/review"
          className={`group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-extrabold transition-all duration-300 btn-press ${
            dueTotal
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-[#0b1120] shadow-lg shadow-amber-900/20 hover:shadow-amber-500/20'
              : 'bg-white/[0.06] text-slate-400 border border-white/[0.08]'
          }`}
        >
          <Brain size={18} /> {dueTotal ? 'Start review' : 'All caught up'}
          {dueTotal > 0 && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
        </Link>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-children">
        <section className={card} aria-label="Study streak">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl transition-all duration-300 ${insights.streak.studiedToday ? 'bg-amber-500/15 text-amber-400 shadow-lg shadow-amber-500/10' : 'bg-white/[0.06] text-slate-500'}`}>
              <Flame size={22} />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Streak</p>
              <p className="text-2xl font-extrabold text-white">{insights.streak.current} day{insights.streak.current === 1 ? '' : 's'}</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            {insights.streak.studiedToday ? <span className="text-amber-400">🔥 Studied today. Nice!</span> : insights.streak.current ? 'Review or take a quiz today to keep it going.' : 'Review a card today to start a streak.'}
            {' '}Longest: {insights.streak.longest}.
          </p>
        </section>

        <section className={card} aria-label="Daily goal">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Today's goal</p>
          <GoalMeter done={insights.goal.done} target={insights.goal.target} />
          <p className="text-xs text-slate-500 mt-3">Change your daily goal in <Link to="/settings" className="text-amber-400 link-underline">Settings</Link>.</p>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 stagger-children">
        <section className={card}>
          <h3 className="flex items-center gap-2 text-base font-extrabold text-slate-100 mb-4"><CalendarCheck size={18} className="text-amber-400" /> Today's plan</h3>
          <TodaysPlan plan={insights.todaysPlan} />
        </section>

        <section className={card}>
          <h3 className="flex items-center gap-2 text-base font-extrabold text-slate-100 mb-4"><AlertTriangle size={18} className="text-amber-400" /> Weak topics</h3>
          {insights.weakTopics.length === 0 ? (
            <p className="text-sm text-slate-400">No weak spots yet. Take quizzes and review cards; topics you keep missing show up here.</p>
          ) : (
            <ul className="space-y-2">
              {insights.weakTopics.map((t) => (
                <li key={`${t.document}-${t.topic}`} className="flex items-center gap-3 group">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-200 truncate">{t.topic}</p>
                    <p className="text-xs text-slate-500 truncate">{t.documentTitle || 'Deleted document'} · {t.accuracy}% of {t.total}</p>
                  </div>
                  {t.documentTitle && (
                    <Link to={`/quizzes?document=${t.document}&topic=${encodeURIComponent(t.topic)}`} className="text-xs font-bold text-amber-400 hover:text-amber-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">Practice →</Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className={card}>
        <h3 className="text-base font-extrabold text-slate-100 mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-amber-400" /> Activity</h3>
        <ActivityHeatmap days={insights.heatmap} />
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children">
        {[
          { label: 'Documents', value: metrics.totalDocuments ?? 0, icon: Folder },
          { label: 'Flashcards', value: metrics.totalFlashcards ?? 0, icon: Layers },
          { label: 'Quizzes', value: metrics.totalQuizzes ?? 0, icon: Target },
          { label: 'Avg score', value: `${metrics.averageScore ?? 0}%`, icon: Sparkles },
        ].map((m, i) => (
          <StatCard key={m.label} {...m} delay={i * 100} />
        ))}
      </div>

      <section className={card}>
        <h3 className="text-base font-extrabold text-slate-100 mb-4">Recent activity</h3>
        {insights.recentActivity.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">No activity yet. <Link to="/documents" className="text-amber-400 link-underline">Upload a document</Link> to start.</div>
        ) : (
          <ul className="divide-y divide-white/[0.04]">
            {insights.recentActivity.map((a) => {
              const kind = ACTIVITY[a.type] || { icon: FileText, text: () => a.type };
              return (
                <li key={a._id} className="py-3 flex items-center gap-3 group hover:bg-white/[0.02] -mx-2 px-2 rounded-lg transition-colors duration-200">
                  <div className="p-2 rounded-lg bg-white/[0.04] text-slate-400 group-hover:text-amber-400 group-hover:bg-amber-500/10 transition-all duration-200"><kind.icon size={15} /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300 truncate">{kind.text(a)}</p>
                    {a.documentTitle && <Link to={`/documents/${a.document}`} className="text-xs text-slate-500 hover:text-amber-400 truncate block transition-colors">{a.documentTitle}</Link>}
                  </div>
                  <span className="text-xs text-slate-600 whitespace-nowrap">{timeAgo(a.createdAt)}</span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
