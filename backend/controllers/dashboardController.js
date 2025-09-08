import pool from '../models/db.js';
import { format, subDays } from 'date-fns';

export const getDashboardStats = async (req, res) => {
    const userId = req.user.id;
    const today = format(new Date(), 'yyyy-MM-dd');

    try {
        // --- STEP 1: Check if a snapshot for today already exists ---
        const [existingSnapshot] = await pool.query(
            'SELECT key_stats, weekly_chart_data FROM dashboard_snapshots WHERE user_id = ? AND snapshot_date = ?',
            [userId, today]
        );

        const [recentActivities] = await pool.query(
            `SELECT activity_type, details, timestamp FROM user_activity WHERE user_id = ? ORDER BY timestamp DESC LIMIT 5`,
            [userId]
        );

        // --- STEP 2: If a snapshot exists, return it immediately ---
        if (existingSnapshot.length > 0) {
            console.log(`Serving dashboard from snapshot for user ${userId} on ${today}.`);
            return res.json({
                keyStats: existingSnapshot[0].key_stats,
                chartData: existingSnapshot[0].weekly_chart_data,
                recentActivities
            });
        }
        
        console.log(`No snapshot found for user ${userId} on ${today}. Calculating new stats...`);

        // --- STEP 3: Calculate everything from scratch with resilient queries ---
        // We wrap each query in a .catch() block. If one fails, it won't crash the entire process.
        const [activitiesRes, quizHistoryRes, chatHistoryRes] = await Promise.all([
            pool.query(`SELECT activity_type, timestamp FROM user_activity WHERE user_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY)`, [userId]).catch(e => { console.error("Activity query failed:", e.message); return [[]]; }),
            pool.query(`SELECT score, total_questions, timestamp FROM quiz_history WHERE user_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY)`, [userId]).catch(e => { console.error("Quiz history query failed:", e.message); return [[]]; }),
            pool.query(`SELECT timestamp FROM chatbot_history WHERE user_id = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY)`, [userId]).catch(e => { console.error("Chat history query failed:", e.message); return [[]]; })
        ]);

        const activities = activitiesRes[0];
        const quizHistory = quizHistoryRes[0];
        const chatHistory = chatHistoryRes[0];
        
        // Calculate chart data
        const chartData = {};
        for (let i = 6; i >= 0; i--) {
            const date = format(subDays(new Date(), i), 'EEE');
            chartData[date] = { date, chatbot: 0, material: 0, quiz: 0 };
        }
        activities.forEach(a => {
            const date = format(new Date(a.timestamp), 'EEE');
            if (chartData[date] && a.activity_type.startsWith('material')) chartData[date].material++;
        });
        quizHistory.forEach(q => {
            const date = format(new Date(q.timestamp), 'EEE');
            if (chartData[date]) chartData[date].quiz++;
        });
        chatHistory.forEach(c => {
            const date = format(new Date(c.timestamp), 'EEE');
            if (chartData[date]) chartData[date].chatbot++;
        });

        // Calculate key stats
        const totalQuizzes = quizHistory.length;
        const totalMaterials = activities.filter(a => a.activity_type.startsWith('material')).length;
        const totalChats = chatHistory.length;
        let totalScore = 0, totalPossibleScore = 0;
        quizHistory.forEach(q => {
            totalScore += q.score;
            totalPossibleScore += q.total_questions;
        });
        const averageQuizScore = totalPossibleScore > 0 ? Math.round((totalScore / totalPossibleScore) * 100) : 0;
        
        const keyStats = { totalQuizzes, totalMaterials, totalChats, averageQuizScore };
        const finalChartData = Object.values(chartData);

        // --- STEP 4: Save the new snapshot to the database for future requests ---
        await pool.query(
            'INSERT INTO dashboard_snapshots (user_id, snapshot_date, key_stats, weekly_chart_data) VALUES (?, ?, ?, ?)',
            [userId, today, JSON.stringify(keyStats), JSON.stringify(finalChartData)]
        );
        console.log(`New dashboard snapshot saved for user ${userId} on ${today}.`);

        res.json({ keyStats, chartData: finalChartData, recentActivities });
    } catch (err) {
        console.error("CRITICAL ERROR in getDashboardStats controller:", err.message);
        res.status(500).send('Server Error');
    }
};
