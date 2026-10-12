import Activity from '../models/Activity.js';
import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import StudyPlan from '../models/StudyPlan.js';
import { State } from '../services/srs.js';
import { activityHeatmap, streaks, countToday, topicStats, isWeak, dayKey } from '../services/activity.js';

const withTitles = async (rows, key = 'document') => {
  const ids = [...new Set(rows.map((r) => String(r[key])).filter((id) => id !== 'undefined' && id !== 'null'))];
  const docs = await Document.find({ _id: { $in: ids } }).select('title');
  const titles = new Map(docs.map((d) => [String(d._id), d.title]));
  return rows.map((r) => ({ ...r, documentTitle: titles.get(String(r[key])) || null }));
};

// @desc    Everything the dashboard needs about study habits
// @route   GET /api/insights/overview
// @access  Private
export const getOverview = async (req, res) => {
  const userId = req.user._id;
  const { timezone = 'UTC', dailyGoal = 20, newCardsPerDay = 20 } = req.user.preferences || {};
  const now = new Date();
  const today = dayKey(now, timezone);

  const [heatmap, reviewsToday, dueReviews, newWaiting, topics, recent, plan] = await Promise.all([
    activityHeatmap(userId, timezone, 365),
    countToday(userId, 'review', timezone),
    Flashcard.countDocuments({ user: userId, 'srs.due': { $lte: now }, 'srs.state': { $ne: State.New } }),
    Flashcard.countDocuments({ user: userId, $or: [{ srs: { $exists: false } }, { 'srs.state': State.New }] }),
    topicStats(userId),
    Activity.find({ user: userId }).sort({ createdAt: -1 }).limit(10).lean(),
    StudyPlan.findOne({ user: userId, examDate: { $gte: today } }).sort({ examDate: 1 }).lean(),
  ]);

  const todaysPlan = plan
    ? { planId: plan._id, title: plan.title, examDate: plan.examDate, tasks: plan.days.find((d) => d.date === today)?.tasks || [] }
    : null;

  res.json({
    today,
    streak: streaks(heatmap),
    goal: { target: dailyGoal, done: reviewsToday.count },
    due: { reviews: dueReviews, new: Math.min(newWaiting, Math.max(0, newCardsPerDay - reviewsToday.newCards)) },
    heatmap,
    weakTopics: await withTitles(topics.filter(isWeak).slice(0, 5)),
    recentActivity: await withTitles(recent),
    todaysPlan,
  });
};

// @desc    Accuracy per topic (quiz answers + flashcard reviews), weakest first
// @route   GET /api/insights/topics?document=
// @access  Private
export const getTopics = async (req, res) => {
  const topics = await topicStats(req.user._id, { documentId: req.validatedQuery?.document });
  res.json({ topics: (await withTitles(topics)).map((t) => ({ ...t, weak: isWeak(t) })) });
};
