import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { startDb, stopDb, api } from './helpers.js';
import { isCorrectAnswer } from '../src/utils/grading.js';

describe('CORS', () => {
  it('allows exact configured origins', async () => {
    const res = await api().get('/').set('Origin', 'https://study-tantra-mern.vercel.app');
    expect(res.headers['access-control-allow-origin']).toBe('https://study-tantra-mern.vercel.app');
  });

  it('rejects look-alike origins that only share a prefix', async () => {
    const res = await api().get('/').set('Origin', 'https://study-tantra-mern.vercel.app.evil.com');
    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });
});

describe('health', () => {
  it('reports 503 for API routes and /healthz while the DB is down', async () => {
    expect(mongoose.connection.readyState).not.toBe(1);
    await api().get('/healthz').expect(503);
    await api().get('/api/documents').expect(503);
  });

  describe('with a database', () => {
    beforeAll(startDb);
    afterAll(stopDb);

    it('reports ok', async () => {
      const res = await api().get('/healthz').expect(200);
      expect(res.body.db).toBe('connected');
    });

    it('returns JSON 404 for unknown routes', async () => {
      const res = await api().get('/api/nope').expect(404);
      expect(res.body.message).toMatch(/not found/i);
    });
  });
});

describe('grading', () => {
  it('ignores case, surrounding whitespace and trailing punctuation', () => {
    const q = { correctAnswer: 'Mitochondria' };
    expect(isCorrectAnswer(q, '  mitochondria. ')).toBe(true);
    expect(isCorrectAnswer(q, 'chloroplast')).toBe(false);
    expect(isCorrectAnswer(q, '')).toBe(false);
  });
});

describe('AI cost limits', () => {
  it('uploads, reprocessing and grading are behind per-user limiters', async () => {
    const routes = await Promise.all([
      import('../src/routes/documentRoutes.js'),
      import('../src/routes/quizRoutes.js'),
    ]);
    const { aiRateLimit, gradingRateLimit } = await import('../src/middlewares/aiRateLimit.js');
    const handlersFor = (router, path, method) =>
      router.default.stack.find((l) => l.route?.path === path && l.route.methods[method])?.route.stack.map((s) => s.handle) || [];

    expect(handlersFor(routes[0], '/', 'post')).toContain(aiRateLimit);
    expect(handlersFor(routes[0], '/:id/reprocess', 'post')).toContain(aiRateLimit);
    expect(handlersFor(routes[1], '/:id/check', 'post')).toContain(gradingRateLimit);
    expect(handlersFor(routes[1], '/:id/submit', 'post')).toContain(gradingRateLimit);
  });
});
