import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCreatePlan, useDeletePlan, useDocuments, usePlans } from '../api/hooks';
import { getErrorMessage } from '../lib/api';

const inputClass =
  'w-full bg-surface-container-low border border-outline-variant/40 text-on-surface p-3 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all';
const labelClass = 'block text-xs font-label font-bold uppercase tracking-wider text-on-surface-variant mb-1.5';

const localToday = () => new Date().toLocaleDateString('en-CA');

const CreatePlanForm = ({ onCreated }) => {
  const { data: documents = [] } = useDocuments();
  const ready = documents.filter((d) => d.status === 'ready');
  const create = useCreatePlan();
  const [form, setForm] = useState({ title: '', examDate: '', minutesPerDay: 60, documentIds: [] });

  const toggleDoc = (id) =>
    setForm((f) => ({
      ...f,
      documentIds: f.documentIds.includes(id) ? f.documentIds.filter((d) => d !== id) : [...f.documentIds, id],
    }));

  const submit = (e) => {
    e.preventDefault();
    create.mutate(form, { onSuccess: (data) => onCreated(data) });
  };

  return (
    <form
      onSubmit={submit}
      className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 md:p-8 shadow-[0_2px_16px_rgba(58,48,42,0.04)] space-y-6"
    >
      <div className="flex items-center gap-2.5 pb-2 border-b border-outline-variant/20">
        <span className="p-2 rounded-xl bg-primary-fixed text-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-[20px]">add_task</span>
        </span>
        <div>
          <h2 className="font-headline text-xl font-bold text-on-surface">Create New Study Plan</h2>
          <p className="text-xs text-on-surface-variant">
            StudyTantra will calculate optimal daily study blocks based on syllabus weight and cognitive retention.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-3">
          <label htmlFor="plan-title" className={labelClass}>
            Plan Title / Course Code
          </label>
          <input
            id="plan-title"
            required
            maxLength={120}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. CS-402 Database Systems Final Mastery"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="plan-exam" className={labelClass}>
            Target Exam Date
          </label>
          <input
            id="plan-exam"
            type="date"
            required
            min={localToday()}
            value={form.examDate}
            onChange={(e) => setForm({ ...form, examDate: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="plan-minutes" className={labelClass}>
            Daily Study Budget
          </label>
          <select
            id="plan-minutes"
            value={form.minutesPerDay}
            onChange={(e) => setForm({ ...form, minutesPerDay: Number(e.target.value) })}
            className={inputClass}
          >
            {[30, 45, 60, 90, 120, 180].map((m) => (
              <option key={m} value={m}>
                {m} minutes / day
              </option>
            ))}
          </select>
        </div>
      </div>

      <fieldset>
        <legend className={labelClass}>Syllabus Documents to Cover</legend>
        {ready.length === 0 ? (
          <p className="text-xs text-on-surface-variant">Upload documents in the Document Library to incorporate into this plan.</p>
        ) : (
          <div className="flex flex-wrap gap-2 pt-1">
            {ready.map((d) => {
              const on = form.documentIds.includes(d._id);
              return (
                <button
                  key={d._id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleDoc(d._id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-label font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    on
                      ? 'bg-primary-fixed border-primary text-primary shadow-sm'
                      : 'border-outline-variant/40 bg-surface-container-low text-on-surface-variant hover:border-outline'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">{on ? 'check' : 'add'}</span>
                  <span>{d.title}</span>
                </button>
              );
            })}
          </div>
        )}
      </fieldset>

      {create.isError && <p className="text-xs text-error font-medium">{getErrorMessage(create.error)}</p>}

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={create.isPending || !form.documentIds.length || !form.examDate || !form.title.trim()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label text-xs font-bold shadow-md hover:shadow-lg transition-all duration-150 transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {create.isPending ? (
            <>
              <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
              <span>Synthesizing Milestone Cadence...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
              <span>Generate Study Plan</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

const Planner = () => {
  const navigate = useNavigate();
  const { data: plans = [], isLoading } = usePlans();
  const deletePlan = useDeletePlan();
  const [creating, setCreating] = useState(false);
  const today = localToday();

  // Aggregate stats across plans
  const totalTasks = plans.reduce((acc, p) => acc + (p.totalTasks || 0), 0);
  const totalDone = plans.reduce((acc, p) => acc + (p.doneTasks || 0), 0);
  const aggregatePct = totalTasks ? Math.round((totalDone / totalTasks) * 100) : 0;

  // Nearest upcoming exam
  const upcomingPlans = plans
    .filter((p) => p.examDate >= today)
    .sort((a, b) => new Date(a.examDate) - new Date(b.examDate));
  const nearestPlan = upcomingPlans[0];
  const nearestDaysRemaining = nearestPlan
    ? Math.max(0, Math.ceil((new Date(nearestPlan.examDate) - new Date(today)) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <div className="py-6 space-y-8 max-w-5xl mx-auto">
      {/* Top Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-label font-bold uppercase tracking-wider bg-surface-container-high text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Active Cadence
            </span>
            <span className="text-xs text-on-surface-variant font-label font-medium">
              • {plans.length} Registered {plans.length === 1 ? 'Exam' : 'Exams'}
            </span>
          </div>
          <h1 className="font-headline text-3xl md:text-5xl font-medium tracking-tight text-on-surface">
            Semester Exam Planner &amp; Milestones
          </h1>
          <p className="font-body text-sm text-on-surface-variant max-w-2xl mt-1.5">
            Algorithmic memory stabilization mapped against upcoming exam deadlines. Dynamic study blocks rebalance daily for peak retention.
          </p>
        </div>

        {!creating && (
          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label text-xs font-bold shadow-md hover:shadow-lg transition-all duration-150 transform active:scale-95 cursor-pointer shrink-0"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>New Study Plan</span>
          </button>
        )}
      </header>

      {/* Telemetry Stat Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[10px] uppercase tracking-wider font-label font-bold text-on-surface-variant">
              Syllabus Absorption
            </span>
            <span className="p-1.5 rounded-lg bg-surface-container text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">pie_chart</span>
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-headline text-3xl font-bold text-on-surface">{aggregatePct}%</span>
            <span className="text-xs font-label text-on-surface-variant">total tasks done</span>
          </div>
          <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${aggregatePct}%` }} />
          </div>
        </div>

        {/* Stat 2 */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[10px] uppercase tracking-wider font-label font-bold text-on-surface-variant">
              Remaining Tasks
            </span>
            <span className="p-1.5 rounded-lg bg-surface-container text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">task_alt</span>
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-headline text-3xl font-bold text-on-surface">{totalTasks - totalDone}</span>
            <span className="text-xs font-label text-on-surface-variant">of {totalTasks} scheduled</span>
          </div>
          <p className="text-[11px] font-label text-on-surface-variant mt-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Spaced intervals active
          </p>
        </div>

        {/* Stat 3 */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[10px] uppercase tracking-wider font-label font-bold text-on-surface-variant">
              Next Milestone
            </span>
            <span className="p-1.5 rounded-lg bg-surface-container text-tertiary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">flag</span>
            </span>
          </div>
          <div className="mt-3 flex flex-col">
            <span className="font-headline text-xl font-bold text-on-surface truncate">
              {nearestPlan ? nearestPlan.title : 'None Scheduled'}
            </span>
            <span className="text-xs font-label font-semibold text-tertiary mt-0.5">
              {nearestDaysRemaining !== null ? `In ${nearestDaysRemaining} days (${nearestPlan.examDate})` : 'All exams passed'}
            </span>
          </div>
          <p className="text-[11px] font-label text-on-surface-variant mt-2">Target memory consolidation</p>
        </div>

        {/* Stat 4 */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[10px] uppercase tracking-wider font-label font-bold text-on-surface-variant">
              Recommended Budget
            </span>
            <span className="p-1.5 rounded-lg bg-surface-container text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">hourglass_top</span>
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-headline text-3xl font-bold text-on-surface">
              {nearestPlan ? nearestPlan.minutesPerDay : 60}
            </span>
            <span className="text-xs font-label text-on-surface-variant">min / day</span>
          </div>
          <p className="text-[11px] font-label text-on-surface-variant mt-3 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-primary">verified</span> Prevents cognitive fatigue
          </p>
        </div>
      </section>

      {/* Creation Drawer Form */}
      {creating && (
        <CreatePlanForm
          onCreated={({ plan, truncated }) => navigate(`/planner/${plan._id}`, { state: { truncated } })}
        />
      )}

      {/* Plans List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
          <h2 className="font-headline text-xl font-bold text-on-surface">Registered Exam Roadmaps</h2>
          <span className="text-xs font-label text-on-surface-variant">{plans.length} Active Tracks</span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12 text-on-surface-variant">
            <span className="material-symbols-outlined text-3xl text-primary animate-spin">progress_activity</span>
          </div>
        ) : plans.length === 0 && !creating ? (
          <div className="text-center py-16 bg-surface-container-lowest border border-dashed border-outline-variant/40 rounded-3xl">
            <span className="material-symbols-outlined text-4xl text-outline mb-2">event_busy</span>
            <h3 className="font-headline text-xl font-bold text-on-surface mb-1">No Exam Plans Created Yet</h3>
            <p className="text-sm text-on-surface-variant max-w-md mx-auto mb-4">
              Schedule your first target exam date to generate an adaptive day-by-day retrieval curriculum.
            </p>
            <button
              onClick={() => setCreating(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-label font-bold cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Create Plan</span>
            </button>
          </div>
        ) : (
          <ul className="space-y-3.5">
            {plans.map((p) => {
              const pct = p.totalTasks ? Math.round((p.doneTasks / p.totalTasks) * 100) : 0;
              const past = p.examDate < today;

              return (
                <li
                  key={p._id}
                  className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 hover:bg-surface-container-low transition-colors shadow-sm flex items-center gap-4 group"
                >
                  <Link to={`/planner/${p._id}`} className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="p-1 rounded bg-primary-fixed text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-[16px]">event_note</span>
                      </span>
                      <p className="font-headline text-lg font-bold text-on-surface truncate group-hover:text-primary transition-colors">
                        {p.title}
                      </p>
                      {past && (
                        <span className="text-[10px] font-label font-bold uppercase px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                          Completed
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-on-surface-variant font-label">
                      Exam on {new Date(`${p.examDate}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} · {p.doneTasks}/{p.totalTasks} tasks complete · {pct}% retention readiness
                    </p>
                    <div
                      className="h-2 rounded-full bg-surface-container-high mt-3 overflow-hidden"
                      role="meter"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={pct}
                      aria-label="Plan progress"
                    >
                      <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                  </Link>

                  <button
                    onClick={() => window.confirm('Delete this plan?') && deletePlan.mutate(p._id)}
                    aria-label="Delete plan"
                    className="p-2.5 rounded-xl text-on-surface-variant hover:text-error hover:bg-surface-container transition-colors cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Planner;
