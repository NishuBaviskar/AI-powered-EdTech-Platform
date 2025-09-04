import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/authRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import userActivityRoutes from './routes/userActivityRoutes.js';
import materialRoutes from './routes/materialRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import quizHistoryRoutes from './routes/quizHistoryRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js'; // Import the new dashboard routes
import { testConnection } from './models/db.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

testConnection();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/activity', userActivityRoutes);
app.use('/api/material', materialRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/history', quizHistoryRoutes);
app.use('/api/dashboard', dashboardRoutes); // Add the new dashboard routes here

app.get('/', (req, res) => {
    res.send('AI EdTech Platform API is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});