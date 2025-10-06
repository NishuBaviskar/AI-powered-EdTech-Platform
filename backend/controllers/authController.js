/*import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../models/db.js';
import fetch from 'node-fetch';

// --- REGISTER A NEW USER (FINAL, PERMANENTLY FIXED VERSION) ---
export const register = async (req, res) => {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        return res.status(400).json({ message: "Username, email, and password are required." });
    }

    try {
        const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [newUser] = await pool.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
        const payload = { user: { id: newUser.insertId } };

        // --- THIS IS THE CRITICAL FIX FOR THE REGISTER FUNCTION ---
        // We apply the same Promise-based fix to ensure we await the token generation.
        const token = await new Promise((resolve, reject) => {
            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '5h' },
                (err, generatedToken) => {
                    if (err) {
                        console.error("--- BACKEND CRITICAL ERROR: JWT Signing Failed during registration ---", err);
                        return reject(err);
                    }
                    resolve(generatedToken);
                }
            );
        });
        
        // This is now GUARANTEED to run only after the token is created.
        res.status(201).json({ token });

    } catch (err) {
        console.error("--- BACKEND CRITICAL ERROR in register controller ---", err);
        res.status(500).send('Server error during registration');
    }
};


// --- LOG IN AN EXISTING USER (ALREADY CORRECTED) ---
export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }
    try {
        const [user] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (user.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const payload = { user: { id: user[0].id } };
        const token = await new Promise((resolve, reject) => {
            jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, generatedToken) => {
                if (err) return reject(err);
                resolve(generatedToken);
            });
        });
        res.json({ token });
    } catch (err) {
        console.error("--- BACKEND CRITICAL ERROR in login controller ---", err);
        res.status(500).send('Server error during login');
    }
};


// --- AI CHATBOT (NO CHANGES NEEDED) ---
export const chatbot = async (req, res) => {
    const { message } = req.body;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    /*if (!GEMINI_API_KEY) {
        return res.status(500).send("Server is missing Gemini API Key.");
    }*/
    // --- THIS IS THE BULLETPROOF CHECK ---
    /*if (!GEMINI_API_KEY) {
        console.error("FATAL ERROR in chatbot: GEMINI_API_KEY is missing from environment variables.");
        return res.status(500).json({ message: "Server misconfiguration: AI service is unavailable." });
    }
    
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
    
    const systemPrompt = "You are a friendly and encouraging AI tutor for students. Keep your answers concise, helpful, and easy to understand. Your name is Sparky.";

    const payload = {
        contents: [{ parts: [{ text: systemPrompt }, { text: `Student question: ${message}` }] }],
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 250,
        },
    };

    try {
        const apiResponse = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const responseData = await apiResponse.json();
        if (!apiResponse.ok || !responseData.candidates) {
            console.error("Gemini API Error (Chatbot):", responseData);
            throw new Error(`API call failed. Status: ${apiResponse.status}`);
        }
        const reply = responseData.candidates[0].content.parts[0].text;
        res.json({ reply });
    } catch (err) {
        console.error('Error with Gemini API (Chatbot):', err.message);
        res.status(500).send('AI Chatbot error');
    }
};*/

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../models/db.js';
import fetch from 'node-fetch';

// --- REGISTER A NEW USER (FINAL, PERMANENTLY FIXED VERSION) ---
export const register = async (req, res) => {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        return res.status(400).json({ message: "Username, email, and password are required." });
    }

    try {
        const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [newUser] = await pool.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
        const payload = { user: { id: newUser.insertId } };

        const token = await new Promise((resolve, reject) => {
            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '5h' },
                (err, generatedToken) => {
                    if (err) {
                        console.error("--- BACKEND CRITICAL ERROR: JWT Signing Failed during registration ---", err);
                        return reject(err);
                    }
                    resolve(generatedToken);
                }
            );
        });
        
        res.status(201).json({ token });

    } catch (err) {
        console.error("--- BACKEND CRITICAL ERROR in register controller ---", err);
        res.status(500).send('Server error during registration');
    }
};


// --- LOG IN AN EXISTING USER (FINAL, CORRECTED VERSION) ---
export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }
    try {
        const [user] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (user.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const payload = { user: { id: user[0].id } };
        const token = await new Promise((resolve, reject) => {
            jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, generatedToken) => {
                if (err) return reject(err);
                resolve(generatedToken);
            });
        });
        res.json({ token });
    } catch (err) {
        console.error("--- BACKEND CRITICAL ERROR in login controller ---", err);
        res.status(500).send('Server error during login');
    }
};


// --- AI CHATBOT (FINAL, CLEANED VERSION) ---
export const chatbot = async (req, res) => {
    const { message } = req.body;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    // This is the "bulletproof check" to ensure the API key is loaded.
    if (!GEMINI_API_KEY) {
        console.error("FATAL ERROR in chatbot: GEMINI_API_KEY is missing from environment variables.");
        return res.status(500).json({ message: "Server misconfiguration: AI service is unavailable." });
    }
    
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
    
    const systemPrompt = "You are a friendly and encouraging AI tutor for students. Keep your answers concise, helpful, and easy to understand. Your name is Sparky.";

    const payload = {
        contents: [{ parts: [{ text: systemPrompt }, { text: `Student question: ${message}` }] }],
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 250,
        },
    };

    try {
        const apiResponse = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const responseData = await apiResponse.json();
        if (!apiResponse.ok || !responseData.candidates) {
            console.error("Gemini API Error (Chatbot):", responseData);
            throw new Error(`API call failed. Status: ${apiResponse.status}`);
        }
        const reply = responseData.candidates[0].content.parts[0].text;
        res.json({ reply });
    } catch (err) {
        console.error('Error with Gemini API (Chatbot):', err.message);
        res.status(500).send('AI Chatbot error');
    }
};
