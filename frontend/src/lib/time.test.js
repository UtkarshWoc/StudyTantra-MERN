import { describe, it, expect } from 'vitest';
import { formatInterval } from './time';
import { taskLink } from './tasks';

describe('formatInterval', () => {
  const now = Date.parse('2026-10-12T10:00:00Z');
  const after = (ms) => new Date(now + ms).toISOString();
  it('uses compact units', () => {
    expect(formatInterval(after(10 * 60000), now)).toBe('10m');
    expect(formatInterval(after(5 * 3600000), now)).toBe('5h');
    expect(formatInterval(after(3 * 86400000), now)).toBe('3d');
    expect(formatInterval(after(90 * 86400000), now)).toBe('3mo');
    expect(formatInterval(after(500 * 86400000), now)).toBe('1.4y');
  });
});

describe('taskLink', () => {
  it('routes plan tasks to the right place', () => {
    expect(taskLink({ type: 'review', document: 'd1' })).toBe('/review?document=d1');
    expect(taskLink({ type: 'quiz', document: { _id: 'd1' }, topic: 'Krebs cycle' })).toBe('/quizzes?document=d1&topic=Krebs%20cycle');
    expect(taskLink({ type: 'read', document: 'd2' })).toBe('/documents/d2');
    expect(taskLink({ type: 'quiz' })).toBe('/quizzes');
  });
});
