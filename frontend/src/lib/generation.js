// Shared state/helpers for the AI generation options form (components/GenerationOptions)

export const QUESTION_TYPES = [
  { id: 'mcq', label: 'Multiple choice' },
  { id: 'true_false', label: 'True / False' },
  { id: 'fill_blank', label: 'Fill in the blank' },
  { id: 'short_answer', label: 'Short answer' },
];

export const defaultOptions = (kind) => ({
  count: kind === 'quiz' ? 5 : 10,
  scope: 'all',
  from: 1,
  to: 1,
  query: '',
  difficulty: 'mixed',
  types: ['mcq'],
});

/**
 * Convert the form state into the API request body.
 */
export const toRequestBody = (options, kind) => {
  const scope =
    options.scope === 'pages' ? { type: 'pages', from: Number(options.from) || 1, to: Number(options.to) || 1 }
      : options.scope === 'topic' ? { type: 'topic', query: options.query.trim() }
        : { type: 'all' };
  return {
    count: options.count,
    scope,
    difficulty: options.difficulty,
    ...(kind === 'quiz' ? { types: options.types } : {}),
  };
};
