import Flashcard from '../models/Flashcard.js';
import Document from '../models/Document.js';
import { reviewCard, previewIntervals, isNewCard, State } from '../services/srs.js';
import { recordActivity, countToday } from '../services/activity.js';
import { findOwned } from '../utils/ownership.js';

const toQueueCard = (card, titles, now) => ({
  _id: card._id,
  question: card.question,
  answer: card.answer,
  topic: card.topic,
  document: card.document,
  documentTitle: titles.get(String(card.document)) || '',
  isNew: isNewCard(card),
  due: card.srs?.due || card.createdAt,
  intervals: previewIntervals(card, now),
});

// @desc    Cards to study now: due reviews first, then new cards up to the daily limit
// @route   GET /api/review/queue?document=&limit=
// @access  Private
export const getReviewQueue = async (req, res) => {
  const { document, limit } = req.validatedQuery;
  const now = new Date();
  const prefs = req.user.preferences || {};
  const base = { user: req.user._id, ...(document ? { document } : {}) };

  const dueFilter = { ...base, 'srs.due': { $lte: now }, 'srs.state': { $ne: State.New } };
  const newFilter = { ...base, $or: [{ srs: { $exists: false } }, { 'srs.state': State.New }] };

  const { newCards: newToday } = await countToday(req.user._id, 'review', prefs.timezone);
  const newLimit = prefs.newCardsPerDay ?? 20;
  const newAllowance = Math.max(0, newLimit - newToday);

  const [dueCount, newCount, due] = await Promise.all([
    Flashcard.countDocuments(dueFilter),
    Flashcard.countDocuments(newFilter),
    Flashcard.find(dueFilter).sort({ 'srs.due': 1 }).limit(limit),
  ]);
  const fresh = await Flashcard.find(newFilter).sort({ createdAt: 1 }).limit(Math.min(newAllowance, Math.max(0, limit - due.length)));

  const cards = [...due, ...fresh];
  const docs = await Document.find({ _id: { $in: [...new Set(cards.map((c) => String(c.document)))] } }).select('title');
  const titles = new Map(docs.map((d) => [String(d._id), d.title]));

  res.json({
    cards: cards.map((c) => toQueueCard(c, titles, now)),
    counts: { due: dueCount, new: Math.min(newCount, newAllowance), newWaiting: newCount, newToday, newLimit },
  });
};

// @desc    Record a review (1 Again, 2 Hard, 3 Good, 4 Easy) and reschedule the card
// @route   POST /api/review/:id
// @access  Private
export const submitReview = async (req, res) => {
  const card = await findOwned(Flashcard, req.params.id, req.user._id, 'Flashcard');
  const wasNew = isNewCard(card);
  const now = new Date();

  card.srs = reviewCard(card, req.body.rating, now);
  card.lastReviewed = now;
  await card.save();

  await recordActivity(req.user._id, 'review', {
    document: card.document,
    meta: { rating: req.body.rating, topic: card.topic, wasNew },
  });

  res.json({ flashcard: card, nextDue: card.srs.due });
};
