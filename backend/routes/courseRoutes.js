import express from 'express';
import { getCourses } from '../controllers/courseController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:topic', authMiddleware, getCourses);

export default router;