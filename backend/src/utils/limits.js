// Hard caps on AI generation sizes — the client can ask, but never for more than this.
export const LIMITS = {
  flashcards: { min: 1, max: 30, default: 10 },
  quizQuestions: { min: 1, max: 20, default: 5 },
};

export const clampCount = (value, { min, max, default: fallback }) => {
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
};
