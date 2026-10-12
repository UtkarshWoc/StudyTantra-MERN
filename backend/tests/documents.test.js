import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { startDb, stopDb, clearDb, api, registerUser, auth, uploadPdf } from './helpers.js';
import Flashcard from '../src/models/Flashcard.js';
import Quiz from '../src/models/Quiz.js';
import ChatHistory from '../src/models/ChatHistory.js';

beforeAll(startDb);
afterAll(stopDb);
beforeEach(clearDb);

describe('documents', () => {
  it('uploads a PDF and never exposes storage internals', async () => {
    const { token } = await registerUser();
    const res = await uploadPdf(token).expect(201);
    expect(res.body.title).toBe('Biology Notes');
    for (const key of ['filePath', 'storageKey', 'storageDriver', 'cloudinaryPublicId']) {
      expect(res.body).not.toHaveProperty(key);
    }
  });

  it('rejects files that are not really PDFs', async () => {
    const { token } = await registerUser();
    const res = await uploadPdf(token, { pdf: Buffer.from('not a pdf at all') });
    expect(res.status).toBe(400);
  });

  it('serves the file only to its owner', async () => {
    const owner = await registerUser();
    const other = await registerUser();
    const { body: doc } = await uploadPdf(owner.token).expect(201);

    const file = await api().get(`/api/documents/${doc._id}/file`).set(auth(owner.token)).expect(200);
    expect(file.headers['content-type']).toBe('application/pdf');
    expect(file.body.subarray(0, 5).toString()).toBe('%PDF-');

    await api().get(`/api/documents/${doc._id}/file`).set(auth(other.token)).expect(404);
    await api().get(`/api/documents/${doc._id}`).set(auth(other.token)).expect(404);
    await api().delete(`/api/documents/${doc._id}`).set(auth(other.token)).expect(404);
  });

  it('returns 404 (not 500) for malformed ids', async () => {
    const { token } = await registerUser();
    await api().get('/api/documents/not-an-id').set(auth(token)).expect(404);
  });

  it('deleting a document removes everything generated from it', async () => {
    const { token } = await registerUser();
    const { body: doc } = await uploadPdf(token).expect(201);

    await api().post(`/api/flashcards/generate/${doc._id}`).set(auth(token)).send({ count: 3 }).expect(201);
    await api().post(`/api/quizzes/generate/${doc._id}`).set(auth(token)).send({ count: 3 }).expect(201);
    await api().post(`/api/chat/${doc._id}`).set(auth(token)).send({ message: 'What is this about?' }).expect(200);

    await api().delete(`/api/documents/${doc._id}`).set(auth(token)).expect(200);

    expect(await Flashcard.countDocuments({ document: doc._id })).toBe(0);
    expect(await Quiz.countDocuments({ document: doc._id })).toBe(0);
    expect(await ChatHistory.countDocuments({ document: doc._id })).toBe(0);
    await api().get(`/api/documents/${doc._id}`).set(auth(token)).expect(404);
  });
});

describe('dashboard', () => {
  it('aggregates counts and average quiz score', async () => {
    const { token } = await registerUser();
    const { body: doc } = await uploadPdf(token).expect(201);
    const { body: { quiz } } = await api().post(`/api/quizzes/generate/${doc._id}`).set(auth(token)).send({ count: 4 }).expect(201);
    // Mock quizzes: correct answer is always "A" for mcq
    await api().post(`/api/quizzes/${quiz._id}/submit`).set(auth(token)).send({ answers: ['A', 'A', 'B', 'B'] }).expect(200);

    const res = await api().get('/api/dashboard').set(auth(token)).expect(200);
    expect(res.body.metrics).toMatchObject({ totalDocuments: 1, totalQuizzes: 1, averageScore: 50 });
  });
});
