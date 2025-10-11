/*import fetch from 'node-fetch';

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

export const getQuizQuestions = async(req, res) => {
    const { subject } = req.params;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
        console.error("FATAL: Gemini API Key is missing from .env file.");
        return res.status(500).json({ message: "Server is misconfigured: Missing Gemini API Key." });
    }

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

    const systemPrompt = `You are a quiz generator. Create exactly 10 multiple-choice questions about "${subject}" for a high school student. Respond ONLY with a valid JSON array of objects. Each object must have these exact keys: "question", "options" (an array of 4 strings), and "correct_answer".`;

    try {
        console.log(`--- DEBUG: Generating quiz for "${subject}" using Gemini API... ---`); // Log start

        const apiResponse = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt }] }] })
        });

        const responseData = await apiResponse.json();

        // --- DEBUG: Log the full raw response from Google ---
        console.log("--- DEBUG: Full Gemini API Response ---");
        console.dir(responseData, { depth: null }); // This prints the entire object
        console.log("--------------------------------------");

        if (!apiResponse.ok || !responseData.candidates || responseData.candidates.length === 0) {
            let jsonString = responseData.candidates[0].content.parts[0].text;
        }

        let jsonString = responseData.candidates[0].content.parts[0].text;

        // --- DEBUG: Log the raw text before parsing ---
        console.log("--- DEBUG: Raw JSON string from model ---");
        console.log(jsonString);
        console.log("-----------------------------------------");

        jsonString = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();

        const generatedQuestions = JSON.parse(jsonString);

        const shuffledQuestions = generatedQuestions.map(q => ({
            ...q,
            options: shuffleArray(q.options)
        }));

        res.json(shuffledQuestions);

    } catch (error) {
        // --- DEBUG: Log any error that occurs ---
        console.error("--- DEBUG: CRITICAL ERROR in quizController ---");
        console.error(error.message);
        console.error("---------------------------------------------");
        res.status(500).json({ message: "Failed to generate quiz from the AI model." });
    }
};*/

import fetch from 'node-fetch';

const shuffleArray = (array) => {
    if (!array || !Array.isArray(array)) return [];
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

export const getQuizQuestions = async (req, res) => {
    const { subject } = req.params;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
        console.error("FATAL ERROR in quizController: GEMINI_API_KEY is missing.");
        return res.status(500).json({ message: "Server misconfiguration: Quiz service is unavailable." });
    }
    
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
    
    const systemPrompt = `Create 10 multiple-choice questions about "${subject}". Respond ONLY with a valid JSON array of objects (keys: "question", "options" [array of 4 strings], and "correct_answer").`;
    const payload = { contents: [{ parts: [{ text: systemPrompt }] }] };

    try {
        const apiResponse = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!apiResponse.ok) {
            const errorBody = await apiResponse.text();
            console.error("--- GEMINI API FAILED (Quiz) ---", errorBody);
            throw new Error(`API call failed with status: ${apiResponse.status}`);
        }
        const responseData = await apiResponse.json();
        if (!responseData.candidates) throw new Error("API call succeeded but returned no candidates.");
        let jsonString = responseData.candidates[0].content.parts[0].text.replace(/```json/g, '').replace(/```/g, '').trim();
        const generatedQuestions = JSON.parse(jsonString);
        res.json(generatedQuestions.map(q => ({ ...q, options: shuffleArray(q.options) })));
    } catch (error) {
        console.error("Error fetching quiz from Gemini API:", error);
        res.status(500).json({ message: "Failed to generate quiz from the AI model." });
    }
};
