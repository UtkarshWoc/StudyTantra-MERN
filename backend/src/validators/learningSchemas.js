import { z } from 'zod';
import { isValidTimezone } from '../services/activity.js';

const objectId = z.string().regex(/^[a-f0-9]{24}$/i, 'Invalid id');
const dateKey = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD');

export const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(4),
});

export const reviewQueueQuery = z.object({
  document: objectId.optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50),
});

export const preferencesSchema = z.object({
  dailyGoal: z.coerce.number().int().min(1).max(500).optional(),
  newCardsPerDay: z.coerce.number().int().min(0).max(200).optional(),
  timezone: z.string().max(64).refine(isValidTimezone, 'Unknown timezone').optional(),
});

export const collectionSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(80),
  color: z.enum(['amber', 'emerald', 'sky', 'violet', 'rose', 'slate']).default('amber'),
});

export const collectionUpdateSchema = collectionSchema.partial();

export const documentUpdateSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  collectionId: objectId.nullable().optional(),
});

export const createPlanSchema = z.object({
  title: z.string().trim().min(1, 'Give the plan a name').max(120),
  examDate: dateKey,
  documentIds: z.array(objectId).min(1, 'Pick at least one document').max(20),
  minutesPerDay: z.coerce.number().int().min(15).max(600).default(60),
});

export const planTaskSchema = z.object({
  done: z.boolean(),
});

export const exportQuery = z.object({
  format: z.enum(['csv', 'anki']).default('csv'),
});
