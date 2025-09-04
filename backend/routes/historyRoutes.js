import express from 'express';
import { getChatHistory, saveChatHistory, deleteChatHistory } from '../controllers/historyController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/history/chat - Fetches all chat history for the user
router.get('/chat', authMiddleware, getChatHistory);

// POST /api/history/chat - Saves a new chat entry for the user
router.post('/chat', authMiddleware, saveChatHistory);

// DELETE /api/history/chat - Deletes all chat history for the user
router.delete('/chat', authMiddleware, deleteChatHistory);

export default router;