import express from 'express';
import {
  generateQuiz,
  getQuizzesByDocument,
  getQuizById,
  checkAnswer,
  submitQuiz,
  getQuizAttempts,
} from '../controllers/quizController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/generate/:docId', protect, generateQuiz);
router.get('/document/:docId', protect, getQuizzesByDocument);
router.get('/:id', protect, getQuizById);
router.post('/:id/check', protect, checkAnswer);
router.post('/:id/submit', protect, submitQuiz);
router.get('/:id/attempts', protect, getQuizAttempts);

export default router;
