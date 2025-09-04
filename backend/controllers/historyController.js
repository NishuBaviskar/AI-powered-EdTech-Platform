import pool from '../models/db.js';

// --- GET CHAT HISTORY FOR THE LOGGED-IN USER ---
export const getChatHistory = async(req, res) => {
    try {
        // req.user.id is available from the authMiddleware
        const [history] = await pool.query(
            'SELECT user_message, ai_response, timestamp FROM chatbot_history WHERE user_id = ? ORDER BY timestamp ASC', [req.user.id]
        );
        res.json(history);
    } catch (err) {
        console.error("Error fetching chat history:", err.message);
        res.status(500).send('Server Error');
    }
};

// --- SAVE A NEW CHAT INTERACTION ---
export const saveChatHistory = async(req, res) => {
    const { user_message, ai_response } = req.body;

    if (!user_message || !ai_response) {
        return res.status(400).json({ message: "User message and AI response are required." });
    }

    try {
        await pool.query(
            'INSERT INTO chatbot_history (user_id, user_message, ai_response) VALUES (?, ?, ?)', [req.user.id, user_message, ai_response]
        );
        res.status(201).json({ message: 'Chat history saved successfully' });
    } catch (err) {
        console.error("Error saving chat history:", err.message);
        res.status(500).send('Server Error');
    }
};

// --- NEW FUNCTION TO DELETE CHAT HISTORY ---
export const deleteChatHistory = async(req, res) => {
    try {
        // req.user.id is available from the authMiddleware
        await pool.query(
            'DELETE FROM chatbot_history WHERE user_id = ?', [req.user.id]
        );
        res.status(200).json({ message: 'Chat history cleared successfully' });
    } catch (err) {
        console.error("Error deleting chat history:", err.message);
        res.status(500).send('Server Error');
    }
};