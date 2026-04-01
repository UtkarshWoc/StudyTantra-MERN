import express from 'express';
import { sendChatMessage, getChatHistory } from '../controllers/chatController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/:docId', protect, sendChatMessage);
router.get('/:docId', protect, getChatHistory);

export default router;
