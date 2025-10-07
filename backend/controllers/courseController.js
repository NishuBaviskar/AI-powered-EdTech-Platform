/*import fetch from 'node-fetch';

export const getCourses = async (req, res) => {
    const { topic } = req.params;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    // This check prevents the server from crashing if the key is missing
    if (!GEMINI_API_KEY) {
        console.error("FATAL: Gemini API Key is missing from .env file.");
        return res.status(500).json({ message: "Server is misconfigured: Missing Gemini API Key." });
    }
    
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
    
    const systemPrompt = `You are a helpful course-finding assistant. Find 5-7 high-quality online courses for "${topic}" from platforms like Coursera, Udemy, edX, etc. Respond ONLY with a valid JSON array of objects. Each object must have these keys: "source", "title", "description", "url".`;

    try {
        const apiResponse = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt }] }] })
        });
        const responseData = await apiResponse.json();
        if (!apiResponse.ok || !responseData.candidates) {
            throw new Error(responseData.error?.message || "API call failed.");
        }
        let jsonString = responseData.candidates[0].content.parts[0].text;
        jsonString = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
        res.json(JSON.parse(jsonString));
    } catch (error) {
        console.error("Error fetching courses from Gemini API:", error.message);
        res.status(500).json({ message: "Failed to fetch courses from the AI model." });
    }
};*/
import fetch from 'node-fetch';

export const getCourses = async (req, res) => {
    const { topic } = req.params;
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
        console.error("FATAL ERROR in courseController: GROQ_API_KEY is missing.");
        return res.status(500).json({ message: "Server misconfiguration: Course service is unavailable." });
    }
    
    const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
    const systemPrompt = `Find 5-7 online courses for "${topic}" from platforms like Coursera, Udemy, edX. Respond ONLY with a valid JSON array of objects (keys: "source", "title", "description", "url").`;
    const payload = {
        model: "llama3-70b-8192",
        messages: [{ role: "system", content: systemPrompt }]
    };

    try {
        const apiResponse = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!apiResponse.ok) {
            const errorBody = await apiResponse.text();
            console.error("--- GROQ API FAILED (Courses) ---", errorBody);
            throw new Error(`API call failed with status: ${apiResponse.status}`);
        }
        const responseData = await apiResponse.json();
        let jsonString = responseData.choices[0]?.message?.content.replace(/```json/g, '').replace(/```/g, '').trim();
        res.json(JSON.parse(jsonString));
    } catch (error) {
        console.error("Error fetching courses from Groq API:", error);
        res.status(500).json({ message: "Failed to fetch courses from the AI model." });
    }
};
