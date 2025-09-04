import pool from '../models/db.js';

// --- GET USER PROFILE ---
export const getProfile = async(req, res) => {
    try {
        // req.user.id is available thanks to our authMiddleware
        const [user] = await pool.query(
            'SELECT username, email, age, school_college_name, education_level, field_of_study, hobbies, city FROM users WHERE id = ?', [req.user.id]
        );

        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user[0]);
    } catch (err) {
        console.error("Error fetching profile:", err.message);
        res.status(500).send('Server Error');
    }
};

// --- UPDATE USER PROFILE ---
export const updateProfile = async(req, res) => {
    // We get the specific fields the user wants to update from the request body
    const { username, age, school_college_name, education_level, field_of_study, hobbies, city } = req.body;

    try {
        await pool.query(
            `UPDATE users SET 
                username = ?, 
                age = ?, 
                school_college_name = ?, 
                education_level = ?, 
                field_of_study = ?, 
                hobbies = ?, 
                city = ? 
            WHERE id = ?`, [username, age, school_college_name, education_level, field_of_study, hobbies, city, req.user.id]
        );

        res.json({ message: 'Profile updated successfully' });
    } catch (err) {
        console.error("Error updating profile:", err.message);
        res.status(500).send('Server Error');
    }
};