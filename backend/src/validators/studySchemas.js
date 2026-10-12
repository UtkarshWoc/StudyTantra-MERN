import { z } from 'zod';
import { LIMITS } from '../utils/limits.js';

export const generateFlashcardsSchema = z.object({
  count: z.coerce.number().int().min(LIMITS.flashcards.min).max(LIMITS.flashcards.max).default(LIMITS.flashcards.default),
});

export const generateQuizSchema = z.object({
  count: z.coerce.number().int().min(LIMITS.quizQuestions.min).max(LIMITS.quizQuestions.max).default(LIMITS.quizQuestions.default),
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
