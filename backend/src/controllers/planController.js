import mongoose from 'mongoose';
import StudyPlan from '../models/StudyPlan.js';
import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';
import DocumentPage from '../models/DocumentPage.js';
import { generateStudyPlan } from '../services/ai/index.js';
import { topicStats, isWeak, dayKey, dayRange, shiftKey } from '../services/activity.js';
import { findOwned } from '../utils/ownership.js';
import { badRequest, HttpError, notFoundError } from '../utils/httpError.js';

// Longer horizons make huge, low-quality plans; plan the next stretch and regenerate later.
const MAX_PLAN_DAYS = 45;
const MAX_TASKS_PER_DAY = 6;
const TASK_TYPES = ['read', 'review', 'flashcards', 'quiz'];

const daysBetween = (fromKey, toKey) => Math.round((Date.parse(toKey) - Date.parse(fromKey)) / 86400000);

// What the planner knows about each document: title, topics seen so far, a short summary
const describeDocuments = async (userId, docs) =>
  Promise.all(docs.map(async (doc) => {
    const [cardTopics, quizTopics, firstPage] = await Promise.all([
      Flashcard.distinct('topic', { user: userId, document: doc._id }),
      Quiz.distinct('questions.topic', { user: userId, document: doc._id }),
      doc.summary ? null : DocumentPage.findOne({ document: doc._id }).sort({ page: 1 }).lean(),
    ]);
    return {
      id: String(doc._id),
      title: doc.title,
      pages: doc.pageCount,
      topics: [...new Set([...cardTopics, ...quizTopics])].filter(Boolean).slice(0, 12),
      summary: (doc.summary || firstPage?.text || '').slice(0, 600),
    };
  }));

const sanitizeDays = (aiDays, dates, docIds) => {
  const byDate = new Map((Array.isArray(aiDays) ? aiDays : []).map((d) => [d?.date, d?.tasks]));
  return dates.map((date) => ({
    date,
    tasks: (Array.isArray(byDate.get(date)) ? byDate.get(date) : [])
      .filter((t) => t?.title)
      .slice(0, MAX_TASKS_PER_DAY)
      .map((t) => ({
        type: TASK_TYPES.includes(t.type) ? t.type : 'review',
        title: String(t.title).slice(0, 160),
        description: String(t.description || '').slice(0, 500),
        document: docIds.has(String(t.documentId)) ? t.documentId : undefined,
        topic: t.topic ? String(t.topic).slice(0, 80) : undefined,
        minutes: Math.min(240, Math.max(5, Number(t.minutes) || 30)),
      })),
  }));
};

const summarizePlan = (plan) => {
  const tasks = plan.days.flatMap((d) => d.tasks);
  return {
    _id: plan._id,
    title: plan.title,
    examDate: plan.examDate,
    minutesPerDay: plan.minutesPerDay,
    createdAt: plan.createdAt,
    totalTasks: tasks.length,
    doneTasks: tasks.filter((t) => t.done).length,
  };
};

// @desc    Generate a day-by-day plan up to an exam date
// @route   POST /api/plans
// @access  Private
export const createPlan = async (req, res) => {
  const { title, examDate, documentIds, minutesPerDay } = req.body;
  const timezone = req.user.preferences?.timezone || 'UTC';
  const today = dayKey(new Date(), timezone);

  const untilExam = daysBetween(today, examDate);
  if (untilExam < 1) throw badRequest('The exam date must be after today');
  const dates = dayRange(today, Math.min(untilExam, MAX_PLAN_DAYS));

  const docs = await Document.find({ _id: { $in: documentIds }, user: req.user._id });
  if (docs.length !== new Set(documentIds).size) throw notFoundError('Document not found');
  if (docs.some((d) => d.status !== 'ready')) throw new HttpError(409, 'All documents must finish processing first');

  const [documents, topics] = await Promise.all([
    describeDocuments(req.user._id, docs),
    topicStats(req.user._id),
  ]);
  const docIds = new Set(docs.map((d) => String(d._id)));
  const weakTopics = topics.filter((t) => isWeak(t) && docIds.has(String(t.document))).map((t) => t.topic);

  const result = await generateStudyPlan({ documents, days: dates, minutesPerDay, weakTopics, examDate });
  const days = sanitizeDays(result?.days, dates, docIds);
  if (!days.some((d) => d.tasks.length)) throw new HttpError(502, 'The AI could not build a plan. Please try again.');

  const plan = await StudyPlan.create({ user: req.user._id, title, examDate, minutesPerDay, documents: docs.map((d) => d._id), days });
  res.status(201).json({
    plan,
    truncated: untilExam > MAX_PLAN_DAYS ? `Planned the next ${MAX_PLAN_DAYS} days; create a new plan later for the rest (through ${shiftKey(examDate, -1)}).` : null,
  });
};

// @route   GET /api/plans
export const listPlans = async (req, res) => {
  const plans = await StudyPlan.find({ user: req.user._id }).sort({ examDate: 1 });
  res.json(plans.map(summarizePlan));
};

// @route   GET /api/plans/:id
export const getPlan = async (req, res) => {
  const plan = await findOwned(StudyPlan, req.params.id, req.user._id, 'Plan');
  await plan.populate('documents', 'title');
  res.json(plan);
};

// @desc    Mark a task done / not done
// @route   PATCH /api/plans/:id/tasks/:taskId
export const updatePlanTask = async (req, res) => {
  const plan = await findOwned(StudyPlan, req.params.id, req.user._id, 'Plan');
  if (!mongoose.isValidObjectId(req.params.taskId)) throw notFoundError('Task not found');
  const task = plan.days.flatMap((d) => d.tasks).find((t) => String(t._id) === req.params.taskId);
  if (!task) throw notFoundError('Task not found');
  task.done = req.body.done;
  await plan.save();
  res.json({ task, progress: summarizePlan(plan) });
};

// @route   DELETE /api/plans/:id
export const deletePlan = async (req, res) => {
  const plan = await findOwned(StudyPlan, req.params.id, req.user._id, 'Plan');
  await plan.deleteOne();
  res.json({ message: 'Plan deleted' });
};
