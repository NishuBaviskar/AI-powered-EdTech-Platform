import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306, // Use the port from .env, default to 3306
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // --- THIS IS THE CRITICAL FIX FOR THE CRASH ---
    // This line tells the database client to use a secure SSL connection,
    // which is required by TiDB Cloud.
    ssl: { rejectUnauthorized: true }
});

export const testConnection = async () => {
    try {
        await pool.query('SELECT 1');
        console.log('MySQL Database (TiDB Cloud) connected successfully');
    } catch (error) {
        // We log the full error here for better debugging in production
        console.error('Failed to connect to the database:', error);
    }
};

export default pool;
