import React from 'react';
import { QUESTION_TYPES } from '../lib/generation';

const selectClass = "w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 p-2.5 rounded-xl font-medium cursor-pointer text-sm";
const inputClass = "w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 p-2.5 rounded-xl text-sm";
const labelClass = "block text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5";

/**
 * Options for AI generation: how many, which part of the document, difficulty,
 * and (for quizzes) question types.
 */
const GenerationOptions = ({ kind, value, onChange, pageCount }) => {
  const set = (patch) => onChange({ ...value, ...patch });
  const counts = kind === 'quiz' ? [5, 10, 15, 20] : [5, 10, 20, 30];

  const toggleType = (id) => {
    const types = value.types.includes(id) ? value.types.filter((t) => t !== id) : [...value.types, id];
    if (types.length) set({ types });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div>
        <label htmlFor={`${kind}-count`} className={labelClass}>{kind === 'quiz' ? 'Questions' : 'Cards'}</label>
        <select id={`${kind}-count`} value={value.count} onChange={(e) => set({ count: Number(e.target.value) })} className={selectClass}>
          {counts.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor={`${kind}-scope`} className={labelClass}>From</label>
        <select id={`${kind}-scope`} value={value.scope} onChange={(e) => set({ scope: e.target.value, to: value.to || pageCount || 1 })} className={selectClass}>
          <option value="all">Whole document</option>
          <option value="pages">Page range</option>
          <option value="topic">A topic</option>
        </select>
      </div>

      <div>
        <label htmlFor={`${kind}-difficulty`} className={labelClass}>Difficulty</label>
        <select id={`${kind}-difficulty`} value={value.difficulty} onChange={(e) => set({ difficulty: e.target.value })} className={selectClass}>
          <option value="mixed">Mixed</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {value.scope === 'pages' && (
        <div className="sm:col-span-3 flex items-end gap-3">
          <div className="w-28">
            <label htmlFor={`${kind}-from`} className={labelClass}>First page</label>
            <input id={`${kind}-from`} type="number" min={1} max={pageCount || undefined} value={value.from} onChange={(e) => set({ from: e.target.value })} className={inputClass} />
          </div>
          <div className="w-28">
            <label htmlFor={`${kind}-to`} className={labelClass}>Last page</label>
            <input id={`${kind}-to`} type="number" min={1} max={pageCount || undefined} value={value.to} onChange={(e) => set({ to: e.target.value })} className={inputClass} />
          </div>
          {pageCount ? <span className="text-xs text-gray-400 pb-3">of {pageCount}</span> : null}
        </div>
      )}

      {value.scope === 'topic' && (
        <div className="sm:col-span-3">
          <label htmlFor={`${kind}-topic`} className={labelClass}>Topic</label>
          <input id={`${kind}-topic`} type="text" maxLength={200} value={value.query} onChange={(e) => set({ query: e.target.value })} placeholder="e.g. Krebs cycle, normalization, Article 21" className={inputClass} />
        </div>
      )}

      {kind === 'quiz' && (
        <fieldset className="sm:col-span-3">
          <legend className={labelClass}>Question types</legend>
          <div className="flex flex-wrap gap-2">
            {QUESTION_TYPES.map((t) => {
              const on = value.types.includes(t.id);
              return (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleType(t.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${on ? 'bg-amber-500/15 border-amber-500/50 text-amber-600 dark:text-amber-300' : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400'}`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}
    </div>
  );
};

export default GenerationOptions;
