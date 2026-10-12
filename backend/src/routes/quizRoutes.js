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
import { aiRateLimit } from '../middlewares/aiRateLimit.js';
import { validate } from '../middlewares/validate.js';
import { generateQuizSchema, checkAnswerSchema, submitQuizSchema } from '../validators/studySchemas.js';

const router = express.Router();

router.post('/generate/:docId', protect, aiRateLimit, validate({ body: generateQuizSchema }), generateQuiz);
router.get('/document/:docId', protect, getQuizzesByDocument);
router.get('/:id', protect, getQuizById);
router.post('/:id/check', protect, validate({ body: checkAnswerSchema }), checkAnswer);
router.post('/:id/submit', protect, validate({ body: submitQuizSchema }), submitQuiz);
router.get('/:id/attempts', protect, getQuizAttempts);

export default router;
