import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/profile - Fetches the logged-in user's profile
router.get('/', authMiddleware, getProfile);

// PUT /api/profile - Updates the logged-in user's profile
router.put('/', authMiddleware, updateProfile);

export default router;