import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

// Per-user hourly caps on endpoints that cost model calls. Must run after `protect`.
const perUserHourly = (limit, message) => rateLimit({
  windowMs: 60 * 60 * 1000,
  limit,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => String(req.user._id),
  message: { message },
});

// Generation, chat, summaries, uploads/reprocessing (OCR + embeddings)
export const aiRateLimit = perUserHourly(
  env.AI_RATE_LIMIT_PER_HOUR,
  'You have reached the hourly AI usage limit. Please try again later.'
);

// Answer checking/submission may call the AI to grade free-text answers. Kept
// separate and higher so taking quizzes doesn't consume the generation budget.
export const gradingRateLimit = perUserHourly(
  env.AI_RATE_LIMIT_PER_HOUR * 5,
  'Too many answers checked this hour. Please try again later.'
);
