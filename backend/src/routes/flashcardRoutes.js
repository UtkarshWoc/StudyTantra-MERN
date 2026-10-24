import express from 'express';
import {
  generateFlashcards,
  flashcardFromSelection,
  getFlashcardsByDoc,
  toggleFavorite,
  deleteFlashcard,
  exportFlashcards,
} from '../controllers/flashcardController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { aiRateLimit } from '../middlewares/aiRateLimit.js';
import { validate } from '../middlewares/validate.js';
import { generateFlashcardsSchema, selectionSchema } from '../validators/studySchemas.js';
import { exportQuery } from '../validators/learningSchemas.js';

const router = express.Router();

router.post('/generate/:docId', protect, aiRateLimit, validate({ body: generateFlashcardsSchema }), generateFlashcards);
router.post('/from-selection/:docId', protect, aiRateLimit, validate({ body: selectionSchema }), flashcardFromSelection);
router.get('/export/:docId', protect, validate({ query: exportQuery }), exportFlashcards);
router.get('/:docId', protect, getFlashcardsByDoc);
router.put('/:id/favorite', protect, toggleFavorite);
router.delete('/:id', protect, deleteFlashcard);

export default router;
