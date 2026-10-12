import { describe, it, expect } from 'vitest';
import { defaultOptions, toRequestBody } from './generation';

describe('toRequestBody', () => {
  it('builds the whole-document request by default', () => {
    expect(toRequestBody(defaultOptions('flashcards'), 'flashcards')).toEqual({ count: 10, scope: { type: 'all' }, difficulty: 'mixed' });
  });

  it('includes page ranges, topics and quiz question types', () => {
    const pages = toRequestBody({ ...defaultOptions('quiz'), scope: 'pages', from: '2', to: '7', types: ['mcq', 'short_answer'] }, 'quiz');
    expect(pages).toEqual({ count: 5, scope: { type: 'pages', from: 2, to: 7 }, difficulty: 'mixed', types: ['mcq', 'short_answer'] });

    const topic = toRequestBody({ ...defaultOptions('quiz'), scope: 'topic', query: '  Krebs cycle ' }, 'quiz');
    expect(topic.scope).toEqual({ type: 'topic', query: 'Krebs cycle' });
  });
});
