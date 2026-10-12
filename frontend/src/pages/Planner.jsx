import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarDays, Loader2, Plus, Trash2, Sparkles } from 'lucide-react';
import { useCreatePlan, useDeletePlan, useDocuments, usePlans } from '../api/hooks';
import { getErrorMessage } from '../lib/api';

const inputClass = 'w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 p-2.5 rounded-xl text-sm';
const labelClass = 'block text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5';

const localToday = () => new Date().toLocaleDateString('en-CA');

const CreatePlanForm = ({ onCreated }) => {
  const { data: documents = [] } = useDocuments();
  const ready = documents.filter((d) => d.status === 'ready');
  const create = useCreatePlan();
  const [form, setForm] = useState({ title: '', examDate: '', minutesPerDay: 60, documentIds: [] });

  const toggleDoc = (id) => setForm((f) => ({
    ...f,
    documentIds: f.documentIds.includes(id) ? f.documentIds.filter((d) => d !== id) : [...f.documentIds, id],
  }));

  const submit = (e) => {
    e.preventDefault();
    create.mutate(form, { onSuccess: (data) => onCreated(data) });
  };

  return (
    <form onSubmit={submit} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 space-y-5">
      <h2 className="flex items-center gap-2 font-bold text-gray-900 dark:text-white"><Sparkles size={18} className="text-amber-500" /> New study plan</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-3">
          <label htmlFor="plan-title" className={labelClass}>Name</label>
          <input id="plan-title" required maxLength={120} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. DBMS end-semester" className={inputClass} />
        </div>
        <div>
          <label htmlFor="plan-exam" className={labelClass}>Exam date</label>
          <input id="plan-exam" type="date" required min={localToday()} value={form.examDate} onChange={(e) => setForm({ ...form, examDate: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label htmlFor="plan-minutes" className={labelClass}>Minutes per day</label>
          <select id="plan-minutes" value={form.minutesPerDay} onChange={(e) => setForm({ ...form, minutesPerDay: Number(e.target.value) })} className={inputClass}>
            {[30, 45, 60, 90, 120, 180].map((m) => <option key={m} value={m}>{m} min</option>)}
          </select>
        </div>
      </div>

      <fieldset>
        <legend className={labelClass}>Documents to cover</legend>
        {ready.length === 0 ? (
          <p className="text-sm text-gray-500">Upload a document and wait for it to finish processing first.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {ready.map((d) => {
              const on = form.documentIds.includes(d._id);
              return (
                <button key={d._id} type="button" aria-pressed={on} onClick={() => toggleDoc(d._id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer ${on ? 'bg-amber-500/15 border-amber-500/50 text-amber-600 dark:text-amber-300' : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400'}`}>
                  {d.title}
                </button>
              );
            })}
          </div>
        )}
      </fieldset>

      {create.isError && <p className="text-sm text-red-500">{getErrorMessage(create.error)}</p>}
      <div className="flex justify-end">
        <button type="submit" disabled={create.isPending || !form.documentIds.length || !form.examDate || !form.title.trim()}
          className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-[#0b1120] font-bold disabled:opacity-50 cursor-pointer">
          {create.isPending ? <><Loader2 size={16} className="animate-spin" /> Building your plan...</> : <><Plus size={16} /> Create plan</>}
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
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Study planner</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Tell us your exam date and we'll plan what to study each day, with extra time on your weak topics.</p>
        </div>
        {!creating && (
          <button onClick={() => setCreating(true)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-[#0b1120] font-bold cursor-pointer">
            <Plus size={16} /> New plan
          </button>
        )}
      </div>

      {creating && <CreatePlanForm onCreated={({ plan, truncated }) => navigate(`/planner/${plan._id}`, { state: { truncated } })} />}

      {isLoading ? (
        <div className="flex justify-center py-12 text-gray-400"><Loader2 className="animate-spin" size={28} /></div>
      ) : plans.length === 0 && !creating ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
          <CalendarDays size={40} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No plans yet.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {plans.map((p) => {
            const pct = p.totalTasks ? Math.round((p.doneTasks / p.totalTasks) * 100) : 0;
            const past = p.examDate < today;
            return (
              <li key={p._id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 flex items-center gap-4">
                <Link to={`/planner/${p._id}`} className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 dark:text-white truncate">{p.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Exam {new Date(`${p.examDate}T00:00:00`).toLocaleDateString()}{past ? ' · finished' : ''} · {p.doneTasks}/{p.totalTasks} tasks</p>
                  <div className="h-1.5 rounded-full bg-amber-500/20 mt-3" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Plan progress">
                    <div className="h-1.5 rounded-full bg-amber-500" style={{ width: `${pct}%` }} />
                  </div>
                </Link>
                <button onClick={() => window.confirm('Delete this plan?') && deletePlan.mutate(p._id)} aria-label="Delete plan" className="p-2 rounded-lg text-gray-400 hover:text-red-500 cursor-pointer"><Trash2 size={16} /></button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Planner;
