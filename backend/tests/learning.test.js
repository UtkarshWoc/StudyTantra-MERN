import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { startDb, stopDb, clearDb, api, registerUser, auth, uploadReady } from './helpers.js';
import { streaks, dayKey, dayRange, shiftKey } from '../src/services/activity.js';
import { reviewCard, previewIntervals, isNewCard } from '../src/services/srs.js';
import Activity from '../src/models/Activity.js';
import Flashcard from '../src/models/Flashcard.js';

beforeAll(startDb);
afterAll(stopDb);
beforeEach(clearDb);

const withDeck = async (count = 3) => {
  const user = await registerUser();
  const doc = await uploadReady(user.token);
  await api().post(`/api/flashcards/generate/${doc._id}`).set(auth(user.token)).send({ count }).expect(201);
  return { ...user, doc };
};

describe('dates & streaks (unit)', () => {
  it('computes day keys in the user timezone and ranges across month ends', () => {
    const instant = new Date('2026-10-12T20:00:00Z');
    expect(dayKey(instant, 'UTC')).toBe('2026-10-12');
    expect(dayKey(instant, 'Asia/Kolkata')).toBe('2026-10-13');
    expect(dayRange('2026-01-30', 3)).toEqual(['2026-01-30', '2026-01-31', '2026-02-01']);
    expect(shiftKey('2026-03-01', -1)).toBe('2026-02-28');
  });

  it('counts current and longest streaks with a grace day for today', () => {
    const days = (pattern) => pattern.split('').map((c, i) => ({ date: String(i), count: c === '1' ? 1 : 0 }));
    expect(streaks(days('0111011'))).toEqual({ current: 2, longest: 3, studiedToday: true });
    expect(streaks(days('0011110'))).toEqual({ current: 4, longest: 4, studiedToday: false });
    expect(streaks(days('1100000'))).toEqual({ current: 0, longest: 2, studiedToday: false });
  });
});

describe('FSRS scheduling (unit)', () => {
  it('schedules further out for better ratings and records state', () => {
    const now = new Date('2026-10-12T10:00:00Z');
    const card = { createdAt: now };
    expect(isNewCard(card)).toBe(true);

    const intervals = previewIntervals(card, now);
    expect(new Date(intervals[1]) < new Date(intervals[4])).toBe(true);

    const reviewed = reviewCard(card, 3, now);
    expect(reviewed.reps).toBe(1);
    expect(reviewed.due > now).toBe(true);
    expect(isNewCard({ srs: reviewed })).toBe(false);
  });
});

describe('review queue', () => {
  it('serves new cards, reschedules reviewed ones and logs activity', async () => {
    const { token, doc } = await withDeck(3);

    const queue = await api().get('/api/review/queue').set(auth(token)).expect(200);
    expect(queue.body.counts).toMatchObject({ due: 0, new: 3 });
    expect(queue.body.cards[0]).toMatchObject({ isNew: true, documentTitle: 'Biology Notes' });
    expect(Object.keys(queue.body.cards[0].intervals)).toEqual(['1', '2', '3', '4']);

    const cardId = queue.body.cards[0]._id;
    const res = await api().post(`/api/review/${cardId}`).set(auth(token)).send({ rating: 4 }).expect(200);
    expect(new Date(res.body.nextDue) > new Date()).toBe(true);

    const after = await api().get(`/api/review/queue?document=${doc._id}`).set(auth(token)).expect(200);
    expect(after.body.cards.map((c) => c._id)).not.toContain(cardId);
    expect(after.body.counts.newToday).toBe(1);

    const log = await Activity.findOne({ type: 'review' });
    expect(log.meta).toMatchObject({ rating: 4, wasNew: true });
    await api().post(`/api/review/${cardId}`).set(auth(token)).send({ rating: 7 }).expect(400);
  });

  it('respects the daily new-card limit and shows due reviews first', async () => {
    const { token } = await withDeck(5);
    await api().put('/api/auth/preferences').set(auth(token)).send({ newCardsPerDay: 2 }).expect(200);

    const queue = await api().get('/api/review/queue').set(auth(token)).expect(200);
    expect(queue.body.cards).toHaveLength(2);

    // Make one reviewed card due again
    const [first] = queue.body.cards;
    await api().post(`/api/review/${first._id}`).set(auth(token)).send({ rating: 3 }).expect(200);
    await Flashcard.updateOne({ _id: first._id }, { 'srs.due': new Date(Date.now() - 1000) });

    const next = await api().get('/api/review/queue').set(auth(token)).expect(200);
    expect(next.body.cards[0]._id).toBe(first._id);
    expect(next.body.counts).toMatchObject({ due: 1, new: 1, newToday: 1, newLimit: 2 });
  });
});

describe('insights', () => {
  it('reports streak, goal, due counts, heatmap and weak topics', async () => {
    const { token, doc } = await withDeck(2);
    await api().put('/api/auth/preferences').set(auth(token)).send({ dailyGoal: 5, timezone: 'Asia/Kolkata' }).expect(200);

    // Fail a quiz on every question to create a weak topic
    const { body: { quiz } } = await api().post(`/api/quizzes/generate/${doc._id}`).set(auth(token)).send({ count: 4 }).expect(201);
    await api().post(`/api/quizzes/${quiz._id}/submit`).set(auth(token)).send({ answers: ['B', 'B', 'B', 'B'] }).expect(200);
    const { body: queue } = await api().get('/api/review/queue').set(auth(token)).expect(200);
    await api().post(`/api/review/${queue.cards[0]._id}`).set(auth(token)).send({ rating: 1 }).expect(200);

    const res = await api().get('/api/insights/overview').set(auth(token)).expect(200);
    expect(res.body.streak).toMatchObject({ current: 1, studiedToday: true });
    expect(res.body.goal).toEqual({ target: 5, done: 1 });
    expect(res.body.heatmap).toHaveLength(365);
    expect(res.body.heatmap.at(-1)).toEqual({ date: res.body.today, count: 2 });
    expect(res.body.weakTopics[0]).toMatchObject({ documentTitle: 'Biology Notes', accuracy: 0 });
    expect(res.body.recentActivity.map((a) => a.type)).toEqual(expect.arrayContaining(['review', 'quiz', 'upload']));

    const topics = await api().get(`/api/insights/topics?document=${doc._id}`).set(auth(token)).expect(200);
    expect(topics.body.topics.some((t) => t.weak)).toBe(true);
  });

  it('validates preferences', async () => {
    const { token } = await registerUser();
    await api().put('/api/auth/preferences').set(auth(token)).send({ timezone: 'Mars/Olympus' }).expect(400);
    const res = await api().put('/api/auth/preferences').set(auth(token)).send({ timezone: 'Asia/Kolkata', dailyGoal: 30 }).expect(200);
    expect(res.body.user.preferences).toEqual({ dailyGoal: 30, newCardsPerDay: 20, timezone: 'Asia/Kolkata' });
  });
});

describe('collections', () => {
  it('groups documents and supports cross-document chat and quizzes', async () => {
    const { token } = await registerUser();
    const a = await uploadReady(token, { title: 'Chapter 1' });
    const b = await uploadReady(token, { title: 'Chapter 2' });

    const { body: col } = await api().post('/api/collections').set(auth(token)).send({ name: 'Biology', color: 'emerald' }).expect(201);
    await api().post('/api/collections').set(auth(token)).send({ name: 'Biology' }).expect(409);

    await api().patch(`/api/documents/${a._id}`).set(auth(token)).send({ collectionId: col._id }).expect(200);
    await api().patch(`/api/documents/${b._id}`).set(auth(token)).send({ collectionId: col._id, title: 'Chapter 2 (renamed)' }).expect(200);

    const list = await api().get('/api/collections').set(auth(token)).expect(200);
    expect(list.body[0]).toMatchObject({ name: 'Biology', documentCount: 2 });

    const chat = await api().post(`/api/chat/collection/${col._id}`).set(auth(token)).send({ message: 'photosynthesis?' }).expect(200);
    expect(chat.body.citations.length).toBeGreaterThan(0);
    expect(['Chapter 1', 'Chapter 2 (renamed)']).toContain(chat.body.citations[0].title);

    const quiz = await api().post(`/api/quizzes/generate/collection/${col._id}`).set(auth(token)).send({ count: 2 }).expect(201);
    expect(quiz.body.quiz.collectionId).toBe(col._id);
    await api().post(`/api/quizzes/generate/collection/${col._id}`).set(auth(token)).send({ scope: { type: 'pages', from: 1, to: 1 } }).expect(400);
    const quizzes = await api().get(`/api/quizzes/collection/${col._id}`).set(auth(token)).expect(200);
    expect(quizzes.body).toHaveLength(1);

    // Deleting the collection keeps the documents
    await api().delete(`/api/collections/${col._id}`).set(auth(token)).expect(200);
    const docs = await api().get('/api/documents').set(auth(token)).expect(200);
    expect(docs.body).toHaveLength(2);
    expect(docs.body.every((d) => d.collectionId === null)).toBe(true);
  });

  it("won't move a document into someone else's collection", async () => {
    const owner = await registerUser();
    const other = await registerUser();
    const doc = await uploadReady(owner.token);
    const { body: col } = await api().post('/api/collections').set(auth(other.token)).send({ name: 'Theirs' }).expect(201);
    await api().patch(`/api/documents/${doc._id}`).set(auth(owner.token)).send({ collectionId: col._id }).expect(404);
    await api().post(`/api/chat/collection/${col._id}`).set(auth(owner.token)).send({ message: 'hi' }).expect(404);
  });
});

describe('study planner', () => {
  it('builds a plan up to the exam and tracks task completion', async () => {
    const { token, doc } = await withDeck(2);
    const today = dayKey(new Date(), 'UTC');
    const examDate = shiftKey(today, 5);

    await api().post('/api/plans').set(auth(token)).send({ title: 'Midterm', examDate: today, documentIds: [doc._id] }).expect(400);

    const res = await api().post('/api/plans').set(auth(token)).send({ title: 'Midterm', examDate, documentIds: [doc._id], minutesPerDay: 45 }).expect(201);
    expect(res.body.plan.days.map((d) => d.date)).toEqual(dayRange(today, 5));
    const task = res.body.plan.days[0].tasks[0];

    const toggled = await api().patch(`/api/plans/${res.body.plan._id}/tasks/${task._id}`).set(auth(token)).send({ done: true }).expect(200);
    expect(toggled.body.progress).toMatchObject({ doneTasks: 1, totalTasks: 5 });

    const overview = await api().get('/api/insights/overview').set(auth(token)).expect(200);
    expect(overview.body.todaysPlan.tasks[0].done).toBe(true);

    const plans = await api().get('/api/plans').set(auth(token)).expect(200);
    expect(plans.body[0]).toMatchObject({ title: 'Midterm', doneTasks: 1 });
    await api().delete(`/api/plans/${res.body.plan._id}`).set(auth(token)).expect(200);
  });
});

describe('export', () => {
  it('exports flashcards as CSV and as an Anki import file', async () => {
    const { token, doc } = await withDeck(2);

    const csv = await api().get(`/api/flashcards/export/${doc._id}?format=csv`).set(auth(token)).expect(200);
    expect(csv.headers['content-type']).toMatch(/text\/csv/);
    expect(csv.headers['content-disposition']).toMatch(/Biology-Notes\.csv/);
    expect(csv.text).toContain('"Mock question 1?","Mock answer 1.","Advanced"');

    const anki = await api().get(`/api/flashcards/export/${doc._id}?format=anki`).set(auth(token)).expect(200);
    expect(anki.text.split('\n')[0]).toBe('#separator:tab');
    expect(anki.text).toContain('Mock question 2?\tMock answer 2.\tBasics');

    await api().get(`/api/flashcards/export/${doc._id}?format=pdf`).set(auth(token)).expect(400);
  });
});
