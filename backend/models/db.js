import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export const testConnection = async() => {
    try {
        await pool.query('SELECT 1');
        console.log('MySQL Database connected successfully');
    } catch (error) {
        console.error('Failed to connect to the database:', error);
    }
};

export default pool;