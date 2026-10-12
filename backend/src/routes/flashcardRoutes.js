import express from 'express';
import {
  generateFlashcards,
  getFlashcardsByDoc,
  toggleFavorite
} from '../controllers/flashcardController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { aiRateLimit } from '../middlewares/aiRateLimit.js';
import { validate } from '../middlewares/validate.js';
import { generateFlashcardsSchema } from '../validators/studySchemas.js';

const router = express.Router();

router.post('/generate/:docId', protect, aiRateLimit, validate({ body: generateFlashcardsSchema }), generateFlashcards);
router.get('/:docId', protect, getFlashcardsByDoc);
router.put('/:id/favorite', protect, toggleFavorite);

export default router;
