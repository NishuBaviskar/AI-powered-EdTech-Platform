import pool from '../models/db.js';

// --- GET QUIZ HISTORY FOR THE LOGGED-IN USER ---
export const getQuizHistory = async(req, res) => {
    try {
        // req.user.id is available from the authMiddleware
        const [history] = await pool.query(
            'SELECT topic, score, total_questions, timestamp FROM quiz_history WHERE user_id = ? ORDER BY timestamp DESC', [req.user.id]
        );
        res.json(history);
    } catch (err) {
        console.error("Error fetching quiz history:", err.message);
        res.status(500).send('Server Error');
    }
};

// --- SAVE A NEW QUIZ RESULT ---
export const saveQuizHistory = async(req, res) => {
    const { topic, score, total_questions } = req.body;

    // Basic validation
    if (!topic || score === undefined || !total_questions) {
        return res.status(400).json({ message: "Topic, score, and total questions are required." });
    }

    try {
        await pool.query(
            'INSERT INTO quiz_history (user_id, topic, score, total_questions) VALUES (?, ?, ?, ?)', [req.user.id, topic, score, total_questions]
        );
        res.status(201).json({ message: 'Quiz history saved successfully' });
    } catch (err) {
        console.error("Error saving quiz history:", err.message);
        res.status(500).send('Server Error');
    }
};