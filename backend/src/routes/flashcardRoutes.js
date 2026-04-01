import express from 'express';
import {
  generateFlashcards,
  getFlashcardsByDoc,
  toggleFavorite
} from '../controllers/flashcardController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/generate/:docId', protect, generateFlashcards);
router.get('/:docId', protect, getFlashcardsByDoc);
router.put('/:id/favorite', protect, toggleFavorite);

export default router;
