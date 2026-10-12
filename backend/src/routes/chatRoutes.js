import express from 'express';
import { sendChatMessage, streamChatMessage, getChatHistory, clearChatHistory } from '../controllers/chatController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { aiRateLimit } from '../middlewares/aiRateLimit.js';
import { validate } from '../middlewares/validate.js';
import { chatMessageSchema } from '../validators/studySchemas.js';

const router = express.Router();

router.post('/:docId/stream', protect, aiRateLimit, validate({ body: chatMessageSchema }), streamChatMessage);
router.post('/:docId', protect, aiRateLimit, validate({ body: chatMessageSchema }), sendChatMessage);
router.get('/:docId', protect, getChatHistory);
router.delete('/:docId', protect, clearChatHistory);

export default router;
