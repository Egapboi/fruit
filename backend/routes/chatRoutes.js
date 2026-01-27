const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const router = express.Router();

// Initialize Gemini with API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'Your_API_Key';
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// System prompt for the plant assistant
const SYSTEM_PROMPT = `You are "Gardening Buddy", a friendly plant care assistant. Be concise (2-4 sentences). Help with watering, sunlight, soil, pests, propagation, and growing tips. Use emojis sparingly 🌱`;

// Chat endpoint
router.post('/', async (req, res) => {
    const { message, history = [] } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        // Build prompt with context
        let fullPrompt = SYSTEM_PROMPT + '\n\n';

        // Add conversation history
        if (history.length > 0) {
            fullPrompt += 'Previous conversation:\n';
            history.slice(-6).forEach(msg => {
                fullPrompt += `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}\n`;
            });
            fullPrompt += '\n';
        }

        fullPrompt += `User: ${message}\nAssistant:`;

        // Generate response with Gemini 2.5 Flash
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt
        });

        const reply = response.text || response.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response.";

        res.json({
            reply: reply.trim(),
            success: true
        });

    } catch (error) {
        console.error('Gemini API error:', error.message);

        // Fallback response if API fails
        res.json({
            reply: "I'm having trouble connecting right now. For most plants, water when the top inch of soil is dry, and ensure they get appropriate light for their species. Try again in a moment! 🌿",
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
