import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

// Per-user cap on AI-backed endpoints (generation, chat, summaries) so a single
// account can't run up the model bill. Must run after `protect`.
export const aiRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: env.AI_RATE_LIMIT_PER_HOUR,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => String(req.user._id),
  message: { message: 'You have reached the hourly AI usage limit. Please try again later.' },
});
