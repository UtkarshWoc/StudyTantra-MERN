import express from 'express';
import { createSummary } from '../controllers/aiController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/summary/:docId', protect, createSummary);

export default router;
