import express from 'express';
import { getQuizHistory, saveQuizHistory } from '../controllers/quizHistoryController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/history/quiz - Fetches all quiz history for the user
router.get('/quiz', authMiddleware, getQuizHistory);

// POST /api/history/quiz - Saves a new quiz result for the user
router.post('/quiz', authMiddleware, saveQuizHistory);

export default router;