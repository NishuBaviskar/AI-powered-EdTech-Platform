/*import fetch from 'node-fetch';
import pool from '../models/db.js'; // Import the database pool

// Helper function to log activities
const logActivity = async(userId, activityType, details = {}) => {
    try {
        await pool.query(
            'INSERT INTO user_activity (user_id, activity_type, details) VALUES (?, ?, ?)', [userId, activityType, JSON.stringify(details)]
        );
        console.log(`Activity logged for user ${userId}: ${activityType}`);
    } catch (error) {
        console.error(`Failed to log activity '${activityType}' for user ${userId}:`, error);
    }
};

export const generateMaterial = async(req, res) => {
    const { topic, materialType } = req.body;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
        return res.status(500).json({ message: "Server is misconfigured: Missing Gemini API Key." });
    }
    if (!topic || !materialType) {
        return res.status(400).json({ message: "Topic and material type are required." });
    }

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
    let systemPrompt = '';

    switch (materialType) {
        case 'notes':
            systemPrompt = `You are an academic assistant. Generate a detailed, well-structured study guide on: "${topic}". Use markdown: # for title, ## for headings, - for lists, and **text** for emphasis.`;
            break;
        case 'flashcards':
            systemPrompt = `You are a flashcard creator. For "${topic}", generate exactly 8 flashcards. Respond ONLY with a valid JSON array of objects. Each object must have "front" and "back" keys.`;
            break;
        case 'summary':
            systemPrompt = `You are a summarization expert. Provide a concise summary of key concepts for "${topic}". Use clean paragraphs.`;
            break;
        default:
            return res.status(400).json({ message: "Invalid material type specified." });
    }

    try {
        const apiResponse = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt }] }] })
        });
        const responseData = await apiResponse.json();
        if (!apiResponse.ok || !responseData.candidates) {
            throw new Error(`API call failed. Status: ${apiResponse.status}`);
        }

        let content = responseData.candidates[0].content.parts[0].text;
        if (materialType === 'flashcards') {
            content = content.replace(/```json/g, '').replace(/```/g, '').trim();
            content = JSON.parse(content);
        }

        // --- ADDED THIS LINE TO LOG THE GENERATION EVENT ---
        await logActivity(req.user.id, 'material_generated', { topic, type: materialType });

        res.json({ content });
    } catch (error) {
        console.error(`Error generating material (${materialType}):`, error.message);
        res.status(500).json({ message: "Failed to generate study material from the AI model." });
    }
};*/

import fetch from 'node-fetch';
import pool from '../models/db.js';

const logActivity = async (userId, activityType, details = {}) => {
    try {
        await pool.query('INSERT INTO user_activity (user_id, activity_type, details) VALUES (?, ?, ?)', [userId, activityType, JSON.stringify(details)]);
    } catch (error) {
        console.error(`Failed to log activity '${activityType}' for user ${userId}:`, error);
    }
};

export const generateMaterial = async (req, res) => {
    const { topic, materialType } = req.body;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
        console.error("FATAL ERROR in materialController: GEMINI_API_KEY is missing.");
        return res.status(500).json({ message: "Server misconfiguration: Material service is unavailable." });
    }

    // --- THIS IS THE CRITICAL FIX ---
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

    let systemPrompt = '';
    switch (materialType) {
        case 'notes':
            systemPrompt = `You are an academic assistant. Generate a detailed, well-structured study guide on: "${topic}". Use markdown: # for title, ## for headings, - for lists, and **text** for emphasis.`;
            break;
        case 'flashcards':
            systemPrompt = `You are a flashcard creator. For "${topic}", generate exactly 8 flashcards. Respond ONLY with a valid JSON array of objects. Each object must have "front" and "back" keys.`;
            break;
        case 'summary':
            systemPrompt = `Provide a concise summary of key concepts for "${topic}". Use clean paragraphs.`;
            break;
        default:
            return res.status(400).json({ message: "Invalid material type specified." });
    }

    try {
        const apiResponse = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt }] }] }) });
        if (!apiResponse.ok) {
            const errorBody = await apiResponse.text();
            console.error("--- GEMINI API FAILED (Material) ---", errorBody);
            throw new Error(`API call failed with status: ${apiResponse.status}`);
        }
        const responseData = await apiResponse.json();
        if (!responseData.candidates) throw new Error("API call succeeded but returned no candidates.");
        let content = responseData.candidates[0].content.parts[0].text;
        if (materialType === 'flashcards') {
            content = JSON.parse(content.replace(/```json/g, '').replace(/```/g, '').trim());
        }
        await logActivity(req.user.id, 'material_generated', { topic, type: materialType });
        res.json({ content });
    } catch (error) {
        console.error(`Error generating material (${materialType}):`, error.message);
        res.status(500).json({ message: "Failed to generate study material." });
    }
};
