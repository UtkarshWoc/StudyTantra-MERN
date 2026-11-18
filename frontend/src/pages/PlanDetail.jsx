import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { usePlan, useTogglePlanTask } from '../api/hooks';
import { taskLink } from '../lib/tasks';

const TYPE_ICON_NAME = {
  read: 'menu_book',
  review: 'neurology',
  flashcards: 'style',
  quiz: 'bolt',
};

const formatDate = (key) =>
  new Date(`${key}T00:00:00`).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

const PlanDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const { data: plan, isLoading, isError } = usePlan(id);
  const toggle = useTogglePlanTask(id);
  const today = new Date().toLocaleDateString('en-CA');

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-on-surface-variant">
        <span className="material-symbols-outlined text-4xl text-primary animate-spin mb-3">progress_activity</span>
        <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant">Loading Study Plan...</p>
      </div>
    );
  }

  if (isError || !plan) {
    return (
      <div className="text-center py-16 text-on-surface-variant bg-surface-container-lowest border border-outline-variant/30 rounded-3xl max-w-lg mx-auto">
        <span className="material-symbols-outlined text-4xl text-outline mb-2">event_busy</span>
        <h2 className="font-headline text-2xl font-bold text-on-surface mb-2">Plan Not Found</h2>
        <p className="text-sm text-on-surface-variant mb-4">The requested exam schedule could not be located.</p>
        <Link
          to="/planner"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-label font-bold"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back to Plans</span>
        </Link>
      </div>
    );
  }

  const tasks = plan.days.flatMap((d) => d.tasks);
  const done = tasks.filter((t) => t.done).length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      {/* Back Link */}
      <Link
        to="/planner"
        className="inline-flex items-center gap-1.5 text-xs font-label font-bold uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        <span>All Study Plans</span>
      </Link>

      {/* Plan Header Bento Card */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 md:p-8 shadow-[0_2px_16px_rgba(58,48,42,0.04)] relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">event_upcoming</span>
            </span>
            <div>
              <span className="text-[10px] font-label font-bold uppercase tracking-widest text-primary">
                Study Plan
              </span>
              <h1 className="font-headline text-2xl md:text-3xl font-bold text-on-surface leading-tight mt-0.5">
                {plan.title}
              </h1>
            </div>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">timer</span>
            <span className="text-xs font-label font-bold text-on-surface">{plan.minutesPerDay} min / day</span>
          </div>
        </div>

        <p className="text-xs md:text-sm text-on-surface-variant mt-2 font-medium">
          Target Date: {formatDate(plan.examDate)} · Documents:{' '}
          <span className="text-on-surface font-semibold">
            {plan.documents.map((d) => d?.title).filter(Boolean).join(', ') || 'No attached documents'}
          </span>
        </p>

        {/* Progress Bar */}
        <div className="mt-5 pt-4 border-t border-outline-variant/20">
          <div className="flex items-center justify-between text-xs font-label mb-2">
            <span className="font-bold uppercase tracking-wider text-on-surface-variant">Progress</span>
            <span className="font-semibold text-primary">
              {done} of {tasks.length} tasks complete ({pct}%)
            </span>
          </div>
          <div
            className="w-full h-2.5 rounded-full bg-surface-container-high overflow-hidden"
            role="meter"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            aria-label="Plan progress"
          >
            <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {location.state?.truncated && (
          <div className="flex items-start gap-2 text-xs text-primary bg-primary-fixed/30 border border-primary/20 rounded-xl p-3 mt-4">
            <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">info</span>
            <span>{location.state.truncated}</span>
          </div>
        )}
      </div>

      {/* Days Schedule Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-1">
          <h2 className="font-headline text-xl font-bold text-on-surface">Daily Schedule</h2>
          <span className="text-xs font-label text-on-surface-variant">{plan.days.length} Days</span>
        </div>

        <ol className="space-y-3.5">
          {plan.days.map((day) => {
            const isToday = day.date === today;
            const past = day.date < today;

            return (
              <li
                key={day.date}
                id={isToday ? 'today' : undefined}
                className={`rounded-2xl border p-5 md:p-6 transition-all shadow-sm ${
                  isToday
                    ? 'border-primary ring-2 ring-primary/20 bg-primary-fixed/10'
                    : 'border-outline-variant/30 bg-surface-container-lowest'
                } ${past ? 'opacity-70' : ''}`}
              >
                <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-outline-variant/20">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`text-sm font-headline font-bold ${
                        isToday ? 'text-primary' : 'text-on-surface'
                      }`}
                    >
                      {formatDate(day.date)}
                    </span>
                    {isToday && (
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-label font-bold uppercase tracking-wide bg-primary text-on-primary">
                        Today
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-label text-on-surface-variant">
                    {day.tasks.length} {day.tasks.length === 1 ? 'Task' : 'Tasks'}
                  </span>
                </div>

                {day.tasks.length === 0 ? (
                  <p className="text-xs text-on-surface-variant italic py-1">Rest day — no tasks scheduled.</p>
                ) : (
                  <ul className="space-y-2.5">
                    {day.tasks.map((task) => {
                      const iconName = TYPE_ICON_NAME[task.type] || 'menu_book';

                      return (
                        <li
                          key={task._id}
                          className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low/60 hover:bg-surface-container-low transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={task.done}
                            aria-label={`Mark "${task.title}" done`}
                            onChange={(e) => toggle.mutate({ taskId: task._id, done: e.target.checked })}
                            className="mt-1 w-4 h-4 accent-primary cursor-pointer rounded"
                          />
                          <span className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">
                            {iconName}
                          </span>
                          <div className="flex-1 min-w-0">
                            <Link
                              to={taskLink(task)}
                              className={`text-sm font-semibold transition-colors block leading-snug ${
                                task.done
                                  ? 'line-through text-on-surface-variant/60'
                                  : 'text-on-surface hover:text-primary'
                              }`}
                            >
                              {task.title}
                            </Link>
                            {task.description && (
                              <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                                {task.description}
                              </p>
                            )}
                          </div>
                          <span className="text-[11px] font-label font-semibold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-md whitespace-nowrap">
                            {task.minutes} min
                          </span>
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
    </div>
  );
};

export default PlanDetail;
