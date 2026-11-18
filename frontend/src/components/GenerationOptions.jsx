import React from 'react';
import { QUESTION_TYPES } from '../lib/generation';

const selectClass =
  'w-full bg-surface-container-low border border-outline-variant/40 text-on-surface p-2.5 rounded-xl font-label font-semibold cursor-pointer text-xs focus:outline-none focus:border-primary/60 focus:bg-surface-container-lowest transition-all';
const inputClass =
  'w-full bg-surface-container-low border border-outline-variant/40 text-on-surface p-2.5 rounded-xl text-xs font-body focus:outline-none focus:border-primary/60 focus:bg-surface-container-lowest transition-all';
const labelClass = 'block text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-1.5';

/**
 * Options for AI generation: how many, which part of the document, difficulty,
 * and (for quizzes) question types.
 */
const GenerationOptions = ({ kind, value, onChange, pageCount, allowPages = true }) => {
  const set = (patch) => onChange({ ...value, ...patch });
  const counts = kind === 'quiz' ? [5, 10, 15, 20] : [5, 10, 20, 30];

  const toggleType = (id) => {
    const types = value.types.includes(id) ? value.types.filter((t) => t !== id) : [...value.types, id];
    if (types.length) set({ types });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-body">
      <div>
        <label htmlFor={`${kind}-count`} className={labelClass}>
          {kind === 'quiz' ? 'Question Count' : 'Flashcard Quantity'}
        </label>
        <select
          id={`${kind}-count`}
          value={value.count}
          onChange={(e) => set({ count: Number(e.target.value) })}
          className={selectClass}
        >
          {counts.map((n) => (
            <option key={n} value={n}>
              {n} {kind === 'quiz' ? 'Questions' : 'Cards'}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${kind}-scope`} className={labelClass}>
          Ingestion Scope
        </label>
        <select
          id={`${kind}-scope`}
          value={value.scope}
          onChange={(e) => set({ scope: e.target.value, to: value.to || pageCount || 1 })}
          className={selectClass}
        >
          <option value="all">Whole Document</option>
          {allowPages && <option value="pages">Specific Page Range</option>}
          <option value="topic">Custom Topic / Concept</option>
        </select>
      </div>

      <div>
        <label htmlFor={`${kind}-difficulty`} className={labelClass}>
          Cognitive Difficulty
        </label>
        <select
          id={`${kind}-difficulty`}
          value={value.difficulty}
          onChange={(e) => set({ difficulty: e.target.value })}
          className={selectClass}
        >
          <option value="mixed">Balanced / Mixed</option>
          <option value="easy">Easy (Core Definitions)</option>
          <option value="medium">Medium (Analytical Proofs)</option>
          <option value="hard">Hard (Multi-Step Derivations)</option>
        </select>
      </div>

      {value.scope === 'pages' && (
        <div className="sm:col-span-3 flex items-end gap-3 p-3 rounded-xl bg-surface-container border border-outline-variant/30">
          <div className="flex-1">
            <label htmlFor={`${kind}-from`} className={labelClass}>
              From Page
            </label>
            <input
              id={`${kind}-from`}
              type="number"
              min="1"
              max={pageCount || 999}
              value={value.from || 1}
              onChange={(e) => set({ from: Number(e.target.value) })}
              className={inputClass}
            />
          </div>
          <div className="flex-1">
            <label htmlFor={`${kind}-to`} className={labelClass}>
              To Page
            </label>
            <input
              id={`${kind}-to`}
              type="number"
              min={value.from || 1}
              max={pageCount || 999}
              value={value.to || pageCount || 1}
              onChange={(e) => set({ to: Number(e.target.value) })}
              className={inputClass}
            />
          </div>
          {pageCount && (
            <span className="text-[11px] text-on-surface-variant pb-2 font-label">
              Total {pageCount} pages available
            </span>
          )}
        </div>
      )}

      {value.scope === 'topic' && (
        <div className="sm:col-span-3 p-3 rounded-xl bg-surface-container border border-outline-variant/30">
          <label htmlFor={`${kind}-topic`} className={labelClass}>
            Topic / Key Concept to Extract
          </label>
          <input
            id={`${kind}-topic`}
            type="text"
            value={value.topic || ''}
            onChange={(e) => set({ topic: e.target.value })}
            placeholder="e.g. Validation-Based Concurrency, Spectral Theorem, etc."
            className={inputClass}
          />
        </div>
      )}

      {kind === 'quiz' && (
        <div className="sm:col-span-3 pt-2">
          <label className={labelClass}>Question Typologies</label>
          <div className="flex flex-wrap gap-2">
            {QUESTION_TYPES.map((t) => {
              const active = value.types?.includes(t.id);
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => toggleType(t.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-label font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface border border-outline-variant/30'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerationOptions;
