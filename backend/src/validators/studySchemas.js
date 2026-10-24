import { z } from 'zod';
import { LIMITS } from '../utils/limits.js';
import { QUESTION_TYPES } from '../services/ai/index.js';

// What part of a document a generation task should use
const scopeSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('all') }),
  z.object({
    type: z.literal('pages'),
    from: z.coerce.number().int().min(1),
    to: z.coerce.number().int().min(1),
  }),
  z.object({ type: z.literal('topic'), query: z.string().trim().min(2, 'Enter a topic').max(200) }),
]).default({ type: 'all' });

const difficulty = z.enum(['easy', 'medium', 'hard', 'mixed']).default('mixed');

export const generateFlashcardsSchema = z.object({
  count: z.coerce.number().int().min(LIMITS.flashcards.min).max(LIMITS.flashcards.max).default(LIMITS.flashcards.default),
  scope: scopeSchema,
  difficulty,
  // false: add new cards to the deck (skipping duplicates). true: replace the deck.
  replace: z.boolean().default(false),
});

export const generateQuizSchema = z.object({
  count: z.coerce.number().int().min(LIMITS.quizQuestions.min).max(LIMITS.quizQuestions.max).default(LIMITS.quizQuestions.default),
  scope: scopeSchema,
  difficulty,
  types: z.array(z.enum(QUESTION_TYPES)).min(1).max(QUESTION_TYPES.length).default(['mcq']),
});

export const chatMessageSchema = z.object({
  message: z.string().trim().min(1, 'Message text is required').max(4000, 'Message must be under 4000 characters'),
});

export const checkAnswerSchema = z.object({
  index: z.coerce.number().int().min(0),
  answer: z.string().max(1000).default(''),
});

export const submitQuizSchema = z.object({
  answers: z.array(z.string().max(1000).nullable().transform((v) => v ?? '')).max(LIMITS.quizQuestions.max),
});

export const selectionSchema = z.object({
  text: z.string().trim().min(3, 'Select some text first').max(2000, 'Selection is too long (max 2000 characters)'),
  mode: z.enum(['explain', 'simplify']).default('explain'),
});
