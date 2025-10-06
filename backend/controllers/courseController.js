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
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    // --- THIS IS THE BULLETPROOF CHECK ---
    // This check runs first. If the API key is missing or invalid, it stops everything
    // and sends a clear error message instead of crashing the server.
    if (!GEMINI_API_KEY) {
        console.error("FATAL ERROR in courseController: GEMINI_API_KEY is missing from environment variables.");
        // This clear error message will appear in your frontend if the key is missing.
        return res.status(500).json({ message: "Server misconfiguration: The course generation service is currently unavailable." });
    }
    
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
    
    // A carefully crafted prompt to get structured data
    const systemPrompt = `
      You are a helpful course-finding assistant. Your task is to find 5 to 7 high-quality, real online courses for a given topic from various platforms like Coursera, Udemy, edX, Pluralsight, or official documentation sites.
      
      For the topic "${topic}", provide a list of courses.

      Respond ONLY with a valid JSON array of objects. Each object must have the following keys: "source", "title", "description", and "url". Do not include any introductory text or markdown formatting like \`\`\`json.
    `;

    try {
        console.log(`Fetching courses for: "${topic}" using Gemini API...`);
        const apiResponse = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt }] }] })
        });

        const responseData = await apiResponse.json();

        if (!apiResponse.ok || !responseData.candidates || responseData.candidates.length === 0) {
            console.error("Gemini API Error for Courses:", responseData);
            throw new Error(responseData.error?.message || "API call failed or returned no candidates.");
        }
        
        let jsonString = responseData.candidates[0].content.parts[0].text;
        
        // Clean the response to ensure it's valid JSON, removing potential markdown backticks
        jsonString = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();

        const formattedCourses = JSON.parse(jsonString);
        
        res.json(formattedCourses);

    } catch (error) {
        console.error("Error fetching or parsing courses from Gemini API:", error);
        res.status(500).json({ message: "Failed to fetch courses from the AI model." });
    }
};
