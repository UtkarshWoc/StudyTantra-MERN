import mongoose from 'mongoose';
import Activity from '../models/Activity.js';
import QuizAttempt from '../models/QuizAttempt.js';
import { logger } from '../config/logger.js';

const STUDY_TYPES = ['review', 'quiz'];

/**
 * Record a study event. Never throws: logging must not break the action itself.
 */
export const recordActivity = async (userId, type, { document, meta } = {}) => {
  try {
    await Activity.create({ user: userId, type, document, meta });
  } catch (err) {
    logger.warn({ err: err.message, type }, 'Failed to record activity');
  }
};

export const isValidTimezone = (tz) => {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz });
    return true;
  } catch {
    return false;
  }
};

/** YYYY-MM-DD for `date` in `timezone`. */
export const dayKey = (date, timezone = 'UTC') =>
  new Intl.DateTimeFormat('en-CA', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);

/** Day keys from `start` for `count` days (calendar arithmetic on the key itself). */
export const dayRange = (startKey, count) =>
  Array.from({ length: Math.max(0, count) }, (_, i) => shiftKey(startKey, i));

/** The day key `days` away from `key` (negative = earlier). */
export const shiftKey = (key, days) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
};

/**
 * Activity counts per local day over the last `days` days: [{ date, count }].
 */
export const activityHeatmap = async (userId, timezone, days = 365) => {
  const today = dayKey(new Date(), timezone);
  const start = shiftKey(today, -(days - 1));
  const rows = await Activity.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(String(userId)), type: { $in: STUDY_TYPES }, createdAt: { $gte: new Date(Date.now() - (days + 1) * 86400000) } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone } }, count: { $sum: 1 } } },
  ]);
  const counts = new Map(rows.map((r) => [r._id, r.count]));
  return dayRange(start, days).map((date) => ({ date, count: counts.get(date) || 0 }));
};

/**
 * Current and longest streak of consecutive days with any review or quiz.
 * Today not studied yet doesn't break the current streak until the day ends.
 */
export const streaks = (heatmap) => {
  const studied = heatmap.map((d) => d.count > 0);
  let longest = 0;
  let run = 0;
  for (const s of studied) {
    run = s ? run + 1 : 0;
    longest = Math.max(longest, run);
  }
  let current = 0;
  let i = studied.length - 1;
  if (!studied[i]) i -= 1; // grace for today
  while (i >= 0 && studied[i]) {
    current += 1;
    i -= 1;
  }
  return { current, longest, studiedToday: Boolean(studied.at(-1)) };
};

export const countToday = (userId, type, timezone) => {
  const today = dayKey(new Date(), timezone);
  return Activity.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(String(userId)), type, createdAt: { $gte: new Date(Date.now() - 2 * 86400000) } } },
    { $project: { day: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone } }, meta: 1 } },
    { $match: { day: today } },
    { $group: { _id: null, count: { $sum: 1 }, newCards: { $sum: { $cond: ['$meta.wasNew', 1, 0] } } } },
  ]).then((r) => ({ count: r[0]?.count || 0, newCards: r[0]?.newCards || 0 }));
};

/**
 * Accuracy per topic from quiz answers and flashcard reviews ("Again" = miss).
 * Returns [{ document, topic, correct, total, accuracy }] sorted weakest first.
 */
export const topicStats = async (userId, { documentId, sinceDays = 90 } = {}) => {
  const user = new mongoose.Types.ObjectId(String(userId));
  const since = new Date(Date.now() - sinceDays * 86400000);
  const docFilter = documentId ? { document: new mongoose.Types.ObjectId(String(documentId)) } : {};

  const [quiz, reviews] = await Promise.all([
    QuizAttempt.aggregate([
      { $match: { user, createdAt: { $gte: since }, ...docFilter } },
      { $unwind: '$answers' },
      { $group: { _id: { document: '$document', topic: '$answers.topic' }, correct: { $sum: { $cond: ['$answers.correct', 1, 0] } }, total: { $sum: 1 } } },
    ]),
    Activity.aggregate([
      { $match: { user, type: 'review', createdAt: { $gte: since }, ...docFilter } },
      { $group: { _id: { document: '$document', topic: '$meta.topic' }, correct: { $sum: { $cond: [{ $gt: ['$meta.rating', 1] }, 1, 0] } }, total: { $sum: 1 } } },
    ]),
  ]);

  const merged = new Map();
  for (const row of [...quiz, ...reviews]) {
    const topic = row._id.topic || 'General';
    const key = `${row._id.document}|${topic.toLowerCase()}`;
    const entry = merged.get(key) || { document: row._id.document, topic, correct: 0, total: 0 };
    entry.correct += row.correct;
    entry.total += row.total;
    merged.set(key, entry);
  }
  return [...merged.values()]
    .map((t) => ({ ...t, accuracy: t.total ? Math.round((t.correct / t.total) * 100) : 0 }))
    .sort((a, b) => a.accuracy - b.accuracy || b.total - a.total);
};

// A topic is "weak" once there's enough evidence and accuracy is low.
export const WEAK_TOPIC = { minAttempts: 3, maxAccuracy: 60 };
export const isWeak = (t) => t.total >= WEAK_TOPIC.minAttempts && t.accuracy < WEAK_TOPIC.maxAccuracy;
