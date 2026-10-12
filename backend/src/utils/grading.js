const normalize = (s) =>
  String(s ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[.!?]+$/, '');

/**
 * Deterministic grading for objective questions (MCQ / true-false / fill-in).
 */
export const isCorrectAnswer = (question, answer) =>
  normalize(answer) !== '' && normalize(answer) === normalize(question.correctAnswer);
