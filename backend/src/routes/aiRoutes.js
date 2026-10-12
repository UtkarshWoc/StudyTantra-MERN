import express from 'express';
import { createSummary, explainPassage } from '../controllers/aiController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { aiRateLimit } from '../middlewares/aiRateLimit.js';
import { validate } from '../middlewares/validate.js';
import { selectionSchema } from '../validators/studySchemas.js';

const router = express.Router();

router.post('/summary/:docId', protect, aiRateLimit, createSummary);
router.post('/explain/:docId', protect, aiRateLimit, validate({ body: selectionSchema }), explainPassage);

export default router;
