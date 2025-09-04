import express from 'express';
import { generateMaterial } from '../controllers/materialController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// A POST request to /api/material/generate will trigger the generation
router.post('/generate', authMiddleware, generateMaterial);

export default router;