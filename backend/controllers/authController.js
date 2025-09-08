import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../models/db.js';
import fetch from 'node-fetch';

// --- REGISTER A NEW USER ---
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

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.status(201).json({ token });
        });
    } catch (err) {
        console.error("--- BACKEND CRITICAL ERROR in register controller ---", err.message);
        res.status(500).send('Server error during registration');
    }
};


// --- LOG IN AN EXISTING USER (WITH FULL DEBUGGING) ---
export const login = async (req, res) => {
    // DEBUG STEP 1: Log when the endpoint is hit and what data it receives.
    console.log("--- BACKEND: /api/auth/login endpoint hit ---");
    console.log("Request Body Received:", req.body);
    
    const { email, password } = req.body;

    // A check to make sure data arrived from the frontend
    if (!email || !password) {
        console.log("--- BACKEND ERROR: Email or password was missing in the request. ---");
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        const [user] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (user.length === 0) {
            console.log(`--- BACKEND: Login failed for ${email}. Reason: User not found. ---`);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
            console.log(`--- BACKEND: Login failed for ${email}. Reason: Password incorrect. ---`);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log(`--- BACKEND: Login successful for ${email}. Preparing to generate token. ---`);
        const payload = { user: { id: user[0].id } };
        
        // --- THIS IS THE CRITICAL DEBUGGING STEP for token generation ---
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' },
            (err, token) => {
                if (err) {
                    // If there's an error signing the token, we will see it here.
                    console.error("--- BACKEND CRITICAL ERROR: JWT Signing Failed ---", err);
                    return res.status(500).send('Server error during token generation');
                }

                // If signing is successful, we log the token and send it.
                console.log("--- BACKEND: Token generated successfully. Sending to client. ---");
                console.log("Generated Token (first 15 chars):", token ? token.substring(0, 15) : "Token is NULL or UNDEFINED");
                res.json({ token });
            }
        );
    } catch (err) {
        console.error("--- BACKEND CRITICAL ERROR in login controller ---", err.message);
        res.status(500).send('Server error during login');
    }
};


// --- AI CHATBOT POWERED BY GEMINI API ---
export const chatbot = async (req, res) => {
    const { message } = req.body;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
        return res.status(500).send("Server is missing Gemini API Key.");
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
