import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { startDb, stopDb, clearDb, api, registerUser, auth, uploadPdf } from './helpers.js';

beforeAll(startDb);
afterAll(stopDb);
beforeEach(clearDb);

const setup = async () => {
  const user = await registerUser();
  const { body: doc } = await uploadPdf(user.token).expect(201);
  return { ...user, doc };
};

describe('quizzes', () => {
  it('never sends the answer key before an attempt', async () => {
    const { token, doc } = await setup();
    const gen = await api().post(`/api/quizzes/generate/${doc._id}`).set(auth(token)).send({ count: 3 }).expect(201);
    expect(gen.body.quiz.questions).toHaveLength(3);
    for (const q of gen.body.quiz.questions) {
      expect(q).not.toHaveProperty('correctAnswer');
      expect(q).not.toHaveProperty('explanation');
    }

    const list = await api().get(`/api/quizzes/document/${doc._id}`).set(auth(token)).expect(200);
    expect(list.body[0].questions[0]).not.toHaveProperty('correctAnswer');
    const one = await api().get(`/api/quizzes/${gen.body.quiz._id}`).set(auth(token)).expect(200);
    expect(one.body.questions[0]).not.toHaveProperty('correctAnswer');
  });

  it('rejects counts above the cap', async () => {
    const { token, doc } = await setup();
    await api().post(`/api/quizzes/generate/${doc._id}`).set(auth(token)).send({ count: 1000 }).expect(400);
    await api().post(`/api/flashcards/generate/${doc._id}`).set(auth(token)).send({ count: 1000 }).expect(400);
  });

  it('checks single answers on the server', async () => {
    const { token, doc } = await setup();
    const { body: { quiz } } = await api().post(`/api/quizzes/generate/${doc._id}`).set(auth(token)).send({ count: 2 }).expect(201);

    const right = await api().post(`/api/quizzes/${quiz._id}/check`).set(auth(token)).send({ index: 0, answer: 'A' }).expect(200);
    expect(right.body).toMatchObject({ correct: true, correctAnswer: 'A' });
    const wrong = await api().post(`/api/quizzes/${quiz._id}/check`).set(auth(token)).send({ index: 0, answer: 'C' }).expect(200);
    expect(wrong.body.correct).toBe(false);
    await api().post(`/api/quizzes/${quiz._id}/check`).set(auth(token)).send({ index: 99, answer: 'A' }).expect(400);
  });

  it('grades submissions on the server and records every attempt', async () => {
    const { token, doc } = await setup();
    const { body: { quiz } } = await api().post(`/api/quizzes/generate/${doc._id}`).set(auth(token)).send({ count: 4 }).expect(201);

    const first = await api().post(`/api/quizzes/${quiz._id}/submit`).set(auth(token)).send({ answers: ['A', 'B', 'A', 'B'] }).expect(200);
    expect(first.body).toMatchObject({ score: 2, total: 4, percentage: 50 });
    expect(first.body.quiz.questions[0].correctAnswer).toBe('A');

    await api().post(`/api/quizzes/${quiz._id}/submit`).set(auth(token)).send({ answers: ['A', 'A', 'A', 'A'] }).expect(200);

    const attempts = await api().get(`/api/quizzes/${quiz._id}/attempts`).set(auth(token)).expect(200);
    expect(attempts.body.attempts.map((a) => a.score)).toEqual([4, 2]);
    expect(attempts.body.quiz.questions[0].correctAnswer).toBe('A');
  });

  it('does not let another user read, check or submit a quiz', async () => {
    const { token, doc } = await setup();
    const other = await registerUser();
    const { body: { quiz } } = await api().post(`/api/quizzes/generate/${doc._id}`).set(auth(token)).send({ count: 2 }).expect(201);

    await api().get(`/api/quizzes/${quiz._id}`).set(auth(other.token)).expect(404);
    await api().post(`/api/quizzes/${quiz._id}/check`).set(auth(other.token)).send({ index: 0, answer: 'A' }).expect(404);
    await api().post(`/api/quizzes/${quiz._id}/submit`).set(auth(other.token)).send({ answers: [] }).expect(404);
    await api().post(`/api/quizzes/generate/${doc._id}`).set(auth(other.token)).send({ count: 2 }).expect(404);
  });
});
