import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { startDb, stopDb, clearDb, api, registerUser, auth, uploadPdf, uploadReady, scannedPdf, samplePdf } from './helpers.js';
import { whenIdle } from '../src/services/ingestion/queue.js';
import { chunkPages } from '../src/services/ingestion/chunk.js';
import { cosineSimilarity } from '../src/services/retrieval.js';
import Document from '../src/models/Document.js';
import Chunk from '../src/models/Chunk.js';
import DocumentPage from '../src/models/DocumentPage.js';
import Flashcard from '../src/models/Flashcard.js';

beforeAll(startDb);
afterAll(stopDb);
beforeEach(clearDb);

// Parse a Server-Sent Events body into [{ event, data }]
const parseSse = (text) =>
  text.split('\n\n').filter(Boolean).map((block) => {
    const event = block.match(/^event: (.+)$/m)?.[1];
    const data = block.match(/^data: (.+)$/m)?.[1];
    return { event, data: data ? JSON.parse(data) : null };
  });

describe('chunking & similarity (unit)', () => {
  it('splits pages into bounded, page-tagged, overlapping chunks', () => {
    const pages = [
      { page: 1, text: 'Alpha sentence one. '.repeat(40) },
      { page: 2, text: 'Beta sentence two. '.repeat(40) },
    ];
    const chunks = chunkPages(pages, { maxChars: 500, overlapChars: 100 });
    expect(chunks.length).toBeGreaterThan(2);
    chunks.forEach((c, i) => {
      expect(c.index).toBe(i);
      expect(c.text.length).toBeLessThanOrEqual(600);
      expect(c.pageEnd).toBeGreaterThanOrEqual(c.page);
    });
    expect(chunks.some((c) => c.page === 1 && c.pageEnd === 2)).toBe(true);
    // Overlap: each chunk starts with text from the tail of the previous one
    for (let i = 1; i < chunks.length; i++) {
      const head = chunks[i].text.slice(0, 30);
      expect(chunks[i - 1].text.slice(-200)).toContain(head);
    }
  });

  it('handles empty pages and text with no punctuation', () => {
    expect(chunkPages([{ page: 1, text: '' }])).toEqual([]);
    const long = chunkPages([{ page: 3, text: 'x'.repeat(5000) }], { maxChars: 1000, overlapChars: 0 });
    expect(long.length).toBe(5);
    expect(long.every((c) => c.page === 3)).toBe(true);
  });

  it('computes cosine similarity', () => {
    expect(cosineSimilarity([1, 0], [1, 0])).toBeCloseTo(1);
    expect(cosineSimilarity([1, 0], [0, 1])).toBeCloseTo(0);
    expect(cosineSimilarity([0, 0], [1, 1])).toBe(0);
  });
});

describe('ingestion', () => {
  it('extracts pages, chunks and embeds a document in the background', async () => {
    const { token } = await registerUser();
    const res = await uploadPdf(token).expect(201);
    expect(res.body.status).toBe('processing');

    await whenIdle();
    const doc = await api().get(`/api/documents/${res.body._id}`).set(auth(token)).expect(200);
    expect(doc.body).toMatchObject({ status: 'ready', progress: 100, pageCount: 1, ocr: false });
    expect(await DocumentPage.countDocuments({ document: res.body._id })).toBe(1);
    const chunks = await Chunk.find({ document: res.body._id });
    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks[0].embedding.length).toBeGreaterThan(0);
  });

  it('falls back to OCR for scanned PDFs', async () => {
    const { token } = await registerUser();
    const doc = await uploadReady(token, { pdf: scannedPdf() });
    expect(doc).toMatchObject({ status: 'ready', ocr: true });
    const page = await DocumentPage.findOne({ document: doc._id });
    expect(page.text).toBe('Mock OCR text.');
  });

  it('refuses AI work until the document is ready, and can reprocess', async () => {
    const { token } = await registerUser();
    const doc = await uploadReady(token);
    await Document.updateOne({ _id: doc._id }, { status: 'processing' });

    const res = await api().post(`/api/flashcards/generate/${doc._id}`).set(auth(token)).send({ count: 2 });
    expect(res.status).toBe(409);
    await api().post(`/api/chat/${doc._id}`).set(auth(token)).send({ message: 'hi' }).expect(409);
    await api().post(`/api/documents/${doc._id}/reprocess`).set(auth(token)).expect(409);

    await Document.updateOne({ _id: doc._id }, { status: 'failed' });
    await api().post(`/api/documents/${doc._id}/reprocess`).set(auth(token)).expect(202);
    await whenIdle();
    const after = await api().get(`/api/documents/${doc._id}`).set(auth(token)).expect(200);
    expect(after.body.status).toBe('ready');
  });

  it('deleting a document removes its pages and chunks', async () => {
    const { token } = await registerUser();
    const doc = await uploadReady(token);
    await api().delete(`/api/documents/${doc._id}`).set(auth(token)).expect(200);
    expect(await Chunk.countDocuments({ document: doc._id })).toBe(0);
    expect(await DocumentPage.countDocuments({ document: doc._id })).toBe(0);
  });
});

describe('chat (RAG)', () => {
  it('answers with page citations and stores them', async () => {
    const { token } = await registerUser();
    const doc = await uploadReady(token);
    const res = await api().post(`/api/chat/${doc._id}`).set(auth(token)).send({ message: 'What does photosynthesis convert?' }).expect(200);
    expect(res.body.reply).toContain('[p. 1]');
    expect(res.body.citations[0]).toMatchObject({ page: 1 });
    expect(res.body.history.at(-1).citations[0].page).toBe(1);
  });

  it('streams sources, tokens and a final history over SSE', async () => {
    const { token } = await registerUser();
    const doc = await uploadReady(token);
    const res = await api()
      .post(`/api/chat/${doc._id}/stream`)
      .set(auth(token))
      .send({ message: 'Explain photosynthesis' })
      .buffer(true)
      .parse((r, cb) => { let body = ''; r.on('data', (c) => { body += c; }); r.on('end', () => cb(null, body)); })
      .expect(200);

    expect(res.headers['content-type']).toMatch(/text\/event-stream/);
    const events = parseSse(res.body);
    expect(events[0].event).toBe('sources');
    expect(events[0].data.citations.length).toBeGreaterThan(0);
    const tokens = events.filter((e) => e.event === 'token').map((e) => e.data.text).join('');
    expect(tokens).toContain('[p. 1]');
    const done = events.at(-1);
    expect(done.event).toBe('done');
    expect(done.data.history).toHaveLength(2);

    const history = await api().get(`/api/chat/${doc._id}`).set(auth(token)).expect(200);
    expect(history.body.history[1].content).toBe(tokens);
  });

  it('clears the conversation', async () => {
    const { token } = await registerUser();
    const doc = await uploadReady(token);
    await api().post(`/api/chat/${doc._id}`).set(auth(token)).send({ message: 'hi' }).expect(200);
    await api().delete(`/api/chat/${doc._id}`).set(auth(token)).expect(200);
    const res = await api().get(`/api/chat/${doc._id}`).set(auth(token)).expect(200);
    expect(res.body.history).toEqual([]);
  });
});

describe('generation options', () => {
  it('adds flashcards without duplicating existing ones, or replaces the deck', async () => {
    const { token } = await registerUser();
    const doc = await uploadReady(token);

    const first = await api().post(`/api/flashcards/generate/${doc._id}`).set(auth(token)).send({ count: 3 }).expect(201);
    expect(first.body.added).toBe(3);

    // The mock returns the same questions again: nothing new to add
    await api().post(`/api/flashcards/generate/${doc._id}`).set(auth(token)).send({ count: 3 }).expect(502);
    expect(await Flashcard.countDocuments({ document: doc._id })).toBe(3);

    const replaced = await api().post(`/api/flashcards/generate/${doc._id}`).set(auth(token)).send({ count: 2, replace: true }).expect(201);
    expect(replaced.body.flashcards).toHaveLength(2);
  });

  it('validates page-range and topic scopes', async () => {
    const { token } = await registerUser();
    const doc = await uploadReady(token);
    await api().post(`/api/quizzes/generate/${doc._id}`).set(auth(token)).send({ scope: { type: 'pages', from: 5, to: 9 } }).expect(400);
    await api().post(`/api/quizzes/generate/${doc._id}`).set(auth(token)).send({ scope: { type: 'pages', from: 3, to: 1 } }).expect(400);
    await api().post(`/api/quizzes/generate/${doc._id}`).set(auth(token)).send({ scope: { type: 'topic', query: '' } }).expect(400);

    const ok = await api().post(`/api/quizzes/generate/${doc._id}`).set(auth(token))
      .send({ count: 2, scope: { type: 'topic', query: 'photosynthesis' }, difficulty: 'hard' }).expect(201);
    expect(ok.body.quiz).toMatchObject({ scope: 'Topic: photosynthesis', difficulty: 'hard' });
  });

  it('supports true/false and AI-graded short answers', async () => {
    const { token } = await registerUser();
    const doc = await uploadReady(token);
    const { body: { quiz } } = await api().post(`/api/quizzes/generate/${doc._id}`).set(auth(token))
      .send({ count: 2, types: ['true_false', 'short_answer'] }).expect(201);

    expect(quiz.questions.map((q) => q.type)).toEqual(['true_false', 'short_answer']);
    expect(quiz.questions[0].options).toEqual(['True', 'False']);
    expect(quiz.questions[1].options).toEqual([]);

    // Mock grader accepts answers containing the expected text ("answer")
    const check = await api().post(`/api/quizzes/${quiz._id}/check`).set(auth(token)).send({ index: 1, answer: 'My answer is this' }).expect(200);
    expect(check.body).toMatchObject({ correct: true, feedback: 'Mock feedback.' });

    const submit = await api().post(`/api/quizzes/${quiz._id}/submit`).set(auth(token)).send({ answers: ['False', 'something else'] }).expect(200);
    expect(submit.body.score).toBe(0);
    expect(submit.body.attempt.answers[1].feedback).toBe('Mock feedback.');
  });
});

describe('selection tools', () => {
  it('explains a passage and turns it into a flashcard', async () => {
    const { token } = await registerUser();
    const doc = await uploadReady(token, { pdf: samplePdf('Mitochondria are the powerhouse of the cell') });

    const explain = await api().post(`/api/ai/explain/${doc._id}`).set(auth(token)).send({ text: 'powerhouse of the cell', mode: 'simplify' }).expect(200);
    expect(explain.body.explanation).toBeTruthy();

    const card = await api().post(`/api/flashcards/from-selection/${doc._id}`).set(auth(token)).send({ text: 'Mitochondria are the powerhouse' }).expect(201);
    expect(card.body.flashcard.question).toBeTruthy();

    await api().post(`/api/ai/explain/${doc._id}`).set(auth(token)).send({ text: 'x' }).expect(400);
  });

  it('summarizes from extracted text', async () => {
    const { token } = await registerUser();
    const doc = await uploadReady(token);
    const res = await api().post(`/api/ai/summary/${doc._id}`).set(auth(token)).expect(200);
    expect(res.body.summary).toBeTruthy();
  });
});
