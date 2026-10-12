import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, BookOpen, Brain, Layers, Target, Info } from 'lucide-react';
import { usePlan, useTogglePlanTask } from '../api/hooks';
import { taskLink } from '../lib/tasks';

const TYPE_ICON = { read: BookOpen, review: Brain, flashcards: Layers, quiz: Target };

const formatDate = (key) => new Date(`${key}T00:00:00`).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

const PlanDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const { data: plan, isLoading, isError } = usePlan(id);
  const toggle = useTogglePlanTask(id);
  const today = new Date().toLocaleDateString('en-CA');

  if (isLoading) return <div className="flex justify-center py-16 text-gray-400"><Loader2 className="animate-spin" size={28} /></div>;
  if (isError || !plan) return <p className="text-center py-16 text-gray-400">Plan not found. <Link to="/planner" className="text-amber-400">Back to plans</Link></p>;

  const tasks = plan.days.flatMap((d) => d.tasks);
  const done = tasks.filter((t) => t.done).length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      <Link to="/planner" className="inline-flex items-center gap-1 text-sm font-semibold text-gray-400 hover:text-amber-400"><ArrowLeft size={16} /> All plans</Link>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{plan.title}</h1>
        <p className="text-sm text-gray-500 mt-1">
          Exam {formatDate(plan.examDate)} · {plan.minutesPerDay} min/day · {plan.documents.map((d) => d?.title).filter(Boolean).join(', ')}
        </p>
        <div className="flex items-center gap-3 mt-4">
          <div className="flex-1 h-2 rounded-full bg-amber-500/20" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Plan progress">
            <div className="h-2 rounded-full bg-amber-500" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">{done}/{tasks.length} done</span>
        </div>
        {location.state?.truncated && (
          <p className="flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400 mt-4"><Info size={14} className="shrink-0 mt-0.5" /> {location.state.truncated}</p>
        )}
      </div>

      <ol className="space-y-3">
        {plan.days.map((day) => {
          const isToday = day.date === today;
          const past = day.date < today;
          return (
            <li key={day.date} id={isToday ? 'today' : undefined}
              className={`rounded-2xl border p-5 ${isToday ? 'border-amber-500/50 bg-amber-500/5' : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800'} ${past ? 'opacity-70' : ''}`}>
              <p className="text-sm font-bold text-gray-900 dark:text-white mb-3">
                {formatDate(day.date)} {isToday && <span className="ml-2 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-500 text-[#0b1120]">Today</span>}
              </p>
              {day.tasks.length === 0 ? (
                <p className="text-sm text-gray-500">Rest day</p>
              ) : (
                <ul className="space-y-2.5">
                  {day.tasks.map((task) => {
                    const Icon = TYPE_ICON[task.type] || BookOpen;
                    return (
                      <li key={task._id} className="flex items-start gap-3">
                        <input type="checkbox" checked={task.done} aria-label={`Mark "${task.title}" done`}
                          onChange={(e) => toggle.mutate({ taskId: task._id, done: e.target.checked })}
                          className="mt-1 w-4 h-4 accent-amber-500 cursor-pointer" />
                        <Icon size={16} className="mt-0.5 text-gray-400 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <Link to={taskLink(task)} className={`text-sm font-semibold ${task.done ? 'line-through text-gray-400' : 'text-gray-800 dark:text-gray-100 hover:text-amber-500'}`}>{task.title}</Link>
                          {task.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{task.description}</p>}
                        </div>
                        <span className="text-xs text-gray-400 whitespace-nowrap">{task.minutes} min</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default PlanDetail;
