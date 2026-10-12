// Hard caps on AI generation sizes — the client can ask, but never for more than this.
export const LIMITS = {
  flashcards: { min: 1, max: 30, default: 10 },
  quizQuestions: { min: 1, max: 20, default: 5 },
};
