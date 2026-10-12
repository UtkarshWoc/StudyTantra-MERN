import Document from '../models/Document.js';
import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';
import { generateQuiz as aiGenerateQuiz } from '../services/ai/index.js';
import Collection from '../models/Collection.js';
import { buildStudySource, buildCollectionSource } from '../services/studySource.js';
import { recordActivity } from '../services/activity.js';
import { findOwned } from '../utils/ownership.js';
import { gradeQuestions } from '../utils/grading.js';
import { badRequest, HttpError } from '../utils/httpError.js';

const TRUE_FALSE = ['True', 'False'];

// Keep only well-formed questions of the requested types, normalised per type.
export const sanitizeQuestions = (questions, { count, types }) =>
  (Array.isArray(questions) ? questions : [])
    .map((q) => {
      if (!q?.question || !q?.correctAnswer) return null;
      const type = types.includes(q.type) ? q.type : null;
      const base = { type, question: String(q.question), correctAnswer: String(q.correctAnswer), explanation: q.explanation || '', topic: q.topic || 'General' };
      if (type === 'mcq') {
        const options = Array.isArray(q.options) ? q.options.map(String) : [];
        return options.length >= 2 && options.includes(base.correctAnswer) ? { ...base, options } : null;
      }
      if (type === 'true_false') {
        const answer = TRUE_FALSE.find((o) => o.toLowerCase() === base.correctAnswer.trim().toLowerCase());
        return answer ? { ...base, options: TRUE_FALSE, correctAnswer: answer } : null;
      }
      if (type === 'fill_blank' || type === 'short_answer') return { ...base, options: [] };
      return null;
    })
    .filter(Boolean)
    .slice(0, count);

const describeScope = (scope) =>
  scope.type === 'pages' ? `Pages ${scope.from}-${scope.to}` : scope.type === 'topic' ? `Topic: ${scope.query}` : 'Whole document';

/**
 * Shared generation for document and collection quizzes. `owner` is
 * { document } or { collectionId }.
 */
const createQuiz = async (req, res, { owner, source }) => {
  const { count, scope, difficulty, types } = req.body;
  const { text, focus } = source;

  // Avoid repeating questions from recent quizzes on the same material
  const recent = await Quiz.find({ ...owner, user: req.user._id }).sort({ createdAt: -1 }).limit(5).select('questions.question').lean();
  const avoid = recent.flatMap((q) => q.questions.map((x) => x.question));

  const generated = await aiGenerateQuiz({ source: { text }, count, types, focus, difficulty, avoid });
  const questions = sanitizeQuestions(generated, { count, types });
  if (questions.length === 0) {
    throw new HttpError(502, 'The AI returned an unusable quiz. Please try again.');
  }

  const quiz = await Quiz.create({
    user: req.user._id,
    ...owner,
    questions,
    totalQuestions: questions.length,
    scope: describeScope(scope),
    difficulty,
  });

  await recordActivity(req.user._id, 'generate', { document: owner.document, meta: { kind: 'quiz', count: questions.length } });
  res.status(201).json({ message: 'Quiz generated', quiz: quiz.toPublicJSON() });
};

// @desc    Generate a quiz from a document
// @route   POST /api/quizzes/generate/:docId
// @access  Private
export const generateQuiz = async (req, res) => {
  const document = await findOwned(Document, req.params.docId, req.user._id, 'Document');
  const source = await buildStudySource(document, req.body.scope);
  return createQuiz(req, res, { owner: { document: document._id }, source });
};

// @desc    Generate a quiz across every processed document in a collection
// @route   POST /api/quizzes/generate/collection/:collectionId
// @access  Private
export const generateCollectionQuiz = async (req, res) => {
  const collection = await findOwned(Collection, req.params.collectionId, req.user._id, 'Collection');
  const docs = await Document.find({ user: req.user._id, collectionId: collection._id });
  const source = await buildCollectionSource(docs, req.body.scope);
  return createQuiz(req, res, { owner: { collectionId: collection._id }, source });
};

// @desc    Quizzes for a collection (answers hidden)
// @route   GET /api/quizzes/collection/:collectionId
// @access  Private
export const getQuizzesByCollection = async (req, res) => {
  const collection = await findOwned(Collection, req.params.collectionId, req.user._id, 'Collection');
  const quizzes = await Quiz.find({ collectionId: collection._id, user: req.user._id }).sort({ createdAt: -1 });
  res.json(quizzes.map((q) => q.toPublicJSON()));
};

// @desc    Get all quizzes for a document (answers hidden)
// @route   GET /api/quizzes/document/:docId
// @access  Private
export const getQuizzesByDocument = async (req, res) => {
  await findOwned(Document, req.params.docId, req.user._id, 'Document');
  const quizzes = await Quiz.find({ document: req.params.docId, user: req.user._id }).sort({ createdAt: -1 });
  res.json(quizzes.map((q) => q.toPublicJSON()));
};

// @desc    Get specific quiz (answers hidden)
// @route   GET /api/quizzes/:id
// @access  Private
export const getQuizById = async (req, res) => {
  const quiz = await findOwned(Quiz, req.params.id, req.user._id, 'Quiz');
  res.json(quiz.toPublicJSON());
};

// @desc    Check one answer (instant feedback while taking the quiz)
// @route   POST /api/quizzes/:id/check
// @access  Private
export const checkAnswer = async (req, res) => {
  const quiz = await findOwned(Quiz, req.params.id, req.user._id, 'Quiz');
  const { index, answer } = req.body;
  const question = quiz.questions[index];
  if (!question) throw badRequest('Invalid question index');

  const [result] = await gradeQuestions([question], [answer]);
  res.json({
    index,
    correct: result.correct,
    feedback: result.feedback,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
  });
};

// @desc    Submit a quiz attempt — graded on the server and stored as a QuizAttempt
// @route   POST /api/quizzes/:id/submit
// @access  Private
export const submitQuiz = async (req, res) => {
  const quiz = await findOwned(Quiz, req.params.id, req.user._id, 'Quiz');
  const { answers } = req.body;

  const results = await gradeQuestions(quiz.questions, answers);
  const graded = quiz.questions.map((q, index) => ({
    index,
    answer: answers[index] || '',
    correct: results[index].correct,
    feedback: results[index].feedback,
    topic: q.topic || 'General',
  }));

  const score = graded.filter((a) => a.correct).length;
  const total = quiz.questions.length;
  const percentage = total ? Math.round((score / total) * 100) : 0;

  const attempt = await QuizAttempt.create({
    user: req.user._id,
    quiz: quiz._id,
    document: quiz.document,
    collectionId: quiz.collectionId,
    answers: graded,
    score,
    total,
    percentage,
  });

  quiz.score = score;
  quiz.attempted = true;
  quiz.attemptsCount += 1;
  quiz.bestScore = Math.max(quiz.bestScore || 0, score);
  await quiz.save();
  await recordActivity(req.user._id, 'quiz', { document: quiz.document, meta: { score, total, percentage } });

  // Once submitted, the full answer key is returned for review.
  res.json({ message: 'Quiz submitted', score, total, percentage, attempt, quiz: quiz.toJSON() });
};

// @desc    List attempts for a quiz
// @route   GET /api/quizzes/:id/attempts
// @access  Private
export const getQuizAttempts = async (req, res) => {
  const quiz = await findOwned(Quiz, req.params.id, req.user._id, 'Quiz');
  const attempts = await QuizAttempt.find({ quiz: quiz._id, user: req.user._id }).sort({ createdAt: -1 }).limit(50);
  // Review needs the answer key, but only for quizzes the user has already attempted.
  res.json({ attempts, quiz: attempts.length ? quiz.toJSON() : quiz.toPublicJSON() });
};
