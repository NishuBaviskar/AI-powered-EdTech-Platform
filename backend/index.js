import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// This line MUST be at the very top to ensure all environment variables are loaded
// before they are used by other modules (like the database connection).
dotenv.config();

// Import all the route handlers for your different API features
import authRoutes from './routes/authRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import userActivityRoutes from './routes/userActivityRoutes.js';
import materialRoutes from './routes/materialRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import quizHistoryRoutes from './routes/quizHistoryRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import { testConnection } from './models/db.js';

const app = express();
const PORT = process.env.PORT || 3001;

// --- PRODUCTION-READY CORS CONFIGURATION ---

// We create a "whitelist" of URLs that are allowed to make requests to this API.
// This is a crucial security feature for production.
const whitelist = [
    'http://localhost:3000',      // For your local development frontend
    process.env.FRONTEND_URL      // The live URL of your deployed frontend (e.g., https://edtech-app-nishu.onrender.com)
];

const corsOptions = {
  origin: function (origin, callback) {
    // The `origin` is the URL of the website making the request.
    // This function checks if the incoming origin is in our whitelist.
    // The '!origin' part allows requests that don't have an origin (like from Postman or other server tools).
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true) // Allow the request
    } else {
      // If the origin is not in the whitelist, reject the request.
      callback(new Error('This origin is not allowed by CORS'))
    }
  }
};

// Apply the middleware to the Express app
app.use(cors(corsOptions)); // Use our configured CORS options
app.use(express.json());   // Middleware to parse incoming JSON bodies

// Test the database connection on startup
testConnection();

// --- API ROUTES ---
// Register all the different parts of your API
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/activity', userActivityRoutes);
app.use('/api/material', materialRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/history', quizHistoryRoutes);
app.use('/api/dashboard', dashboardRoutes);

// A simple root route to check if the server is alive
app.get('/', (req, res) => {
    res.send('AI EdTech Platform API is running!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
