import React from 'react';
import { Link } from 'react-router-dom';
import {
  Folder,
  Layers,
  Sparkles,
  Target,
  FileText,
  Brain,
  Upload,
  Zap,
  MessageSquare,
} from 'lucide-react';
import { useDashboard, useInsights, useTogglePlanTask } from '../api/hooks';
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
      <div className="p-4 rounded-2xl bg-surface-container-low text-xs text-on-surface-variant font-body">
        Have an exam coming up?{' '}
        <Link to="/planner" className="font-semibold text-primary hover:underline">
          Create a study plan
        </Link>{' '}
        and your scheduled milestones will appear here.
      </div>
    );
  }

  if (!plan.tasks || !plan.tasks.length) {
    return (
      <div className="p-4 rounded-2xl bg-surface-container-low text-xs text-on-surface-variant">
        No pending tasks today for <strong className="text-on-surface">{plan.title}</strong>. Enjoy the break!
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {plan.tasks.map((task) => (
        <li
          key={task._id}
          className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors group"
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
            className={`flex-1 text-xs font-body transition-colors leading-relaxed ${
              task.done ? 'line-through text-outline' : 'text-on-surface hover:text-primary font-medium'
            }`}
          >
            <span>{task.title}</span>{' '}
            <span className="text-[11px] text-on-surface-variant">· {task.minutes} min</span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

const StatCard = ({ label, value, icon }) => {
  const Icon = icon;
  return (
    <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <span className="text-[10px] uppercase tracking-wider font-label font-bold text-on-surface-variant">
          {label}
        </span>
        <div className="p-2 rounded-xl bg-primary-fixed text-primary flex items-center justify-center">
          <Icon size={18} />
        </div>
      </div>
      <p className="font-headline text-3xl font-bold text-on-surface mt-3">{value}</p>
    </div>
  );
};

const Dashboard = () => {
  const { data: library } = useDashboard();
  const { data: insights, isLoading, isError } = useInsights();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-on-surface-variant">
        <span className="material-symbols-outlined text-4xl text-primary animate-spin mb-3">progress_activity</span>
        <p className="font-label text-xs uppercase tracking-widest">Loading Overview...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-16 text-on-surface-variant bg-surface-container-lowest border border-outline-variant/30 rounded-3xl max-w-lg mx-auto">
        <span className="material-symbols-outlined text-4xl text-outline mb-2">error</span>
        <p className="text-sm font-medium">Could not load dashboard data. Please refresh.</p>
      </div>
    );
  }

  const metrics = library?.metrics || {};

  return (
    <div className="py-6 space-y-8 max-w-6xl mx-auto">
      {/* 4 Metric Bento Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Documents" value={metrics.totalDocuments ?? 0} icon={Folder} />
        <StatCard label="Flashcards" value={metrics.totalFlashcards ?? 0} icon={Layers} />
        <StatCard label="Quizzes" value={metrics.totalQuizzes ?? 0} icon={Target} />
        <StatCard label="Avg Score" value={`${metrics.averageScore ?? 0}%`} icon={Sparkles} />
      </div>

      {/* Annual Activity Heatmap & Recent Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Heatmap (8 Cols) */}
        <section className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]" aria-hidden="true">trending_up</span>
              <h3 className="font-headline text-lg font-bold text-on-surface">Study Activity</h3>
            </div>
            <span className="text-[11px] font-label text-on-surface-variant">Annual History</span>
          </div>
          <ActivityHeatmap days={insights?.heatmap} />
        </section>

        {/* Recent Activity (4 Cols) */}
        <section className="lg:col-span-4 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
            <span className="material-symbols-outlined text-primary text-[20px]" aria-hidden="true">history</span>
            <h3 className="font-headline text-lg font-bold text-on-surface">Recent Activity</h3>
          </div>

          {!insights?.recentActivity || insights.recentActivity.length === 0 ? (
            <div className="text-center py-8 text-on-surface-variant text-xs">
              No activity logged yet.{' '}
              <Link to="/documents" className="text-primary font-semibold underline">
                Upload a document
              </Link>{' '}
              to start.
            </div>
          ) : (
            <ul className="divide-y divide-outline-variant/20">
              {insights.recentActivity.slice(0, 6).map((a) => {
                const kind = ACTIVITY[a.type] || { icon: FileText, text: () => a.type };
                return (
                  <li key={a._id} className="py-2.5 flex items-center gap-3">
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

      {/* Habit Telemetry Row: Streak & Daily Goal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Streak Card */}
        <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-label font-bold uppercase tracking-wider text-on-surface-variant">
              Daily Habit Streak
            </span>
            <span className="p-1.5 rounded-lg bg-primary-fixed text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">local_fire_department</span>
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-headline text-3xl font-bold text-on-surface">
              {insights?.streak?.current || 0}
            </span>
            <span className="text-xs font-label text-on-surface-variant">
              {insights?.streak?.current === 1 ? 'day' : 'days'}
            </span>
          </div>

          <p className="text-xs text-on-surface-variant mt-3 leading-relaxed">
            {insights?.streak?.studiedToday ? (
              <span className="text-primary font-semibold">🔥 Studied today. Nice work!</span>
            ) : insights?.streak?.current ? (
              'Review or complete a quiz today to extend your streak.'
            ) : (
              'Review a card today to ignite a study streak.'
            )}{' '}
            <span className="text-outline">Longest: {insights?.streak?.longest || 0} days.</span>
          </p>
        </section>

        {/* Daily Goal Card */}
        <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm flex flex-col justify-between" aria-label="Daily goal">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-label font-bold uppercase tracking-wider text-on-surface-variant">
              Today's Goal
            </span>
            <span className="p-1.5 rounded-lg bg-primary-fixed text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">flag</span>
            </span>
          </div>

          <div className="my-2">
            <GoalMeter done={insights?.goal?.done || 0} target={insights?.goal?.target || 20} />
          </div>

          <p className="text-xs text-on-surface-variant mt-2">
            Adjust target review volume in{' '}
            <Link to="/settings" className="text-primary font-semibold hover:underline">
              Settings
            </Link>
            .
          </p>
        </section>
      </div>

      {/* 2-Column Split: Today's Plan & Weak Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Plan */}
        <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
            <span className="material-symbols-outlined text-primary text-[20px]" aria-hidden="true">calendar_today</span>
            <h3 className="font-headline text-lg font-bold text-on-surface">Today's Study Plan</h3>
          </div>
          <TodaysPlan plan={insights?.todaysPlan} />
        </section>

        {/* Weak Topics */}
        <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
            <span className="material-symbols-outlined text-tertiary text-[20px]" aria-hidden="true">warning</span>
            <h3 className="font-headline text-lg font-bold text-on-surface">Weak Topics</h3>
          </div>

          {!insights?.weakTopics || insights.weakTopics.length === 0 ? (
            <p className="text-xs text-on-surface-variant leading-relaxed">
              No weak areas detected yet. As you take quizzes and review cards, topics you find challenging will appear here for targeted practice.
            </p>
          ) : (
            <ul className="space-y-2">
              {insights.weakTopics.slice(0, 5).map((t) => (
                <li
                  key={`${t.document}-${t.topic}`}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-on-surface truncate">{t.topic}</p>
                    <p className="text-[11px] text-on-surface-variant truncate">
                      {t.documentTitle || 'Source document'} · {t.accuracy}% accuracy ({t.total} attempts)
                    </p>
                  </div>
                  {t.document && (
                    <Link
                      to={`/quizzes?document=${t.document}&topic=${encodeURIComponent(t.topic)}`}
                      className="text-xs font-label font-bold text-primary hover:underline whitespace-nowrap shrink-0"
                    >
                      Practice →
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
