import express from 'express';
import { getQuizQuestions } from '../controllers/quizController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:subject', authMiddleware, getQuizQuestions);

export default router;