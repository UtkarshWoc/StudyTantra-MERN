import { gradeAnswers } from '../services/ai/index.js';

const normalize = (s) =>
  String(s ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[.!?]+$/, '');

/**
 * Deterministic grading for objective questions (MCQ / true-false / exact fill-in).
 */
export const isCorrectAnswer = (question, answer) =>
  normalize(answer) !== '' && normalize(answer) === normalize(question.correctAnswer);

// Free-text answers that don't match exactly may still be right in meaning.
const needsAI = (question, answer) =>
  ['fill_blank', 'short_answer'].includes(question.type) &&
  normalize(answer) !== '' &&
  !isCorrectAnswer(question, answer);

/**
 * Grade many answers. Objective questions are graded locally; free-text ones
 * that aren't exact matches go to the AI in a single batched call.
 * Returns [{ index, correct, feedback? }] aligned with `questions`.
 */
export const gradeQuestions = async (questions, answers) => {
  const results = questions.map((q, index) => ({ index, correct: isCorrectAnswer(q, answers[index]) }));

  const aiItems = questions
    .map((q, index) => ({ index, question: q.question, expected: q.correctAnswer, answer: String(answers[index] ?? '') }))
    .filter((item) => needsAI(questions[item.index], item.answer));

  if (aiItems.length) {
    const graded = await gradeAnswers(aiItems);
    for (const g of Array.isArray(graded) ? graded : []) {
      if (results[g.index] && aiItems.some((i) => i.index === g.index)) {
        results[g.index] = { index: g.index, correct: Boolean(g.correct), feedback: g.feedback };
      }
    }
  }
  return results;
};
