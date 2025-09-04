import pool from '../models/db.js';

// Get user activity
export const getActivity = async(req, res) => {
    try {
        const [activities] = await pool.query(
            'SELECT activity_type, details, timestamp FROM user_activity WHERE user_id = ? ORDER BY timestamp DESC LIMIT 20', [req.user.id]
        );
        res.json(activities);
    } catch (err) {
        console.error('Error fetching activity:', err.message);
        res.status(500).send('Server error');
    }
};

// Log user activity
export const logActivity = async(req, res) => {
    const { activity_type, details } = req.body;
    try {
        await pool.query(
            'INSERT INTO user_activity (user_id, activity_type, details) VALUES (?, ?, ?)', [req.user.id, activity_type, JSON.stringify(details)]
        );
        res.status(201).json({ message: 'Activity logged' });
    } catch (err) {
        console.error('Error logging activity:', err.message);
        res.status(500).send('Server error');
    }
};