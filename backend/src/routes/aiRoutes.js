import express from 'express';
import { createSummary } from '../controllers/aiController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { aiRateLimit } from '../middlewares/aiRateLimit.js';

const router = express.Router();

router.post('/summary/:docId', protect, aiRateLimit, createSummary);

export default router;
