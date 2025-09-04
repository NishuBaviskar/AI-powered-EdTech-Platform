import express from 'express';
// Rename the import to reflect the new function name
import { getDashboardStats } from '../controllers/dashboardController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/dashboard/stats - Fetches all the data needed for the new dashboard
router.get('/stats', authMiddleware, getDashboardStats);

export default router;