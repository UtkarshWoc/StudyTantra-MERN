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
          <span className="material-symbols-outlined text-[20px]">calendar_month</span>
        </span>
        <div>
          <h2 className="font-headline text-xl font-bold text-on-surface">New Study Plan</h2>
          <p className="text-xs text-on-surface-variant">
            Plan what to study each day with extra focus on your weak topics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-3">
          <label htmlFor="plan-title" className={labelClass}>
            Name
          </label>
          <input
            id="plan-title"
            required
            maxLength={120}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. DBMS end-semester"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="plan-exam" className={labelClass}>
            Exam Date
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
            Minutes Per Day
          </label>
          <select
            id="plan-minutes"
            value={form.minutesPerDay}
            onChange={(e) => setForm({ ...form, minutesPerDay: Number(e.target.value) })}
            className={inputClass}
          >
            {[30, 45, 60, 90, 120, 180].map((m) => (
              <option key={m} value={m}>
                {m} min
              </option>
            ))}
          </select>
        </div>
      </div>

      <fieldset>
        <legend className={labelClass}>Documents to Cover</legend>
        {ready.length === 0 ? (
          <p className="text-xs text-on-surface-variant">Upload a document and wait for it to finish processing first.</p>
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
                      ? 'bg-primary-fixed border-primary text-primary shadow-xs'
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
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label text-xs font-bold shadow-md hover:shadow-lg transition-all duration-150 transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {create.isPending ? (
            <>
              <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
              <span>Building Plan...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Create Plan</span>
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

  return (
    <div className="py-6 space-y-8 max-w-5xl mx-auto font-body">
      {/* Header Banner */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 md:p-8 shadow-[0_2px_16px_rgba(58,48,42,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
            Study Planner
          </h1>
          <p className="font-body text-xs md:text-sm text-on-surface-variant mt-1">
            Tell us your exam date and we'll plan what to study each day, with extra time on your weak topics.
          </p>
        </div>

        {!creating && (
          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label text-xs font-bold shadow-md hover:shadow-lg transition-all duration-150 transform active:scale-95 cursor-pointer shrink-0"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>New Plan</span>
          </button>
        )}
      </div>

      {/* Creation Drawer Form */}
      {creating && (
        <CreatePlanForm
          onCreated={({ plan, truncated }) => navigate(`/planner/${plan._id}`, { state: { truncated } })}
        />
      )}

      {/* Plans List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-16 text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
          </div>
        ) : plans.length === 0 && !creating ? (
          <div className="text-center py-20 bg-surface-container-lowest border border-dashed border-outline-variant/40 rounded-3xl p-8">
            <div className="w-16 h-16 rounded-2xl bg-primary-fixed text-primary mx-auto flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-3xl">event_busy</span>
            </div>
            <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">No Plans Yet</h3>
            <p className="text-xs text-on-surface-variant max-w-sm mx-auto mb-6">
              Create a study plan to map out your upcoming exam syllabus into manageable daily blocks.
            </p>
            <button
              onClick={() => setCreating(true)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-label font-bold cursor-pointer"
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
                      <p className="font-headline text-lg font-bold text-on-surface truncate group-hover:text-primary transition-colors">
                        {p.title}
                      </p>
                      {past && (
                        <span className="text-[10px] font-label font-bold uppercase px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                          Finished
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-on-surface-variant font-label">
                      Exam {new Date(`${p.examDate}T00:00:00`).toLocaleDateString()}{past ? ' · finished' : ''} · {p.doneTasks}/{p.totalTasks} tasks
                    </p>
                    <div
                      className="h-2 rounded-full bg-surface-container-high mt-3 overflow-hidden"
                      role="meter"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={pct}
                      aria-label="Plan progress"
                    >
                      <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${pct}%` }} />
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
