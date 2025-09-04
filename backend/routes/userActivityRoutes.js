import express from 'express';
import { getActivity, logActivity } from '../controllers/userActivityController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getActivity);
router.post('/', authMiddleware, logActivity);

export default router;