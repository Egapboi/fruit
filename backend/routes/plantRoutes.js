const express = require('express');
const router = express.Router();
const multer = require('multer');
const { GoogleGenAI } = require('@google/genai');
const plantsData = require('../data/plants.json');

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Initialize Gemini
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'Your_API_Key';
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Search plants
// This must come BEFORE /:id to avoid collision
router.get('/search', (req, res) => {
    const { q } = req.query; // Query parameter
    if (!q) {
        return res.json([]);
    }
    const results = plantsData.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
    res.json(results);
});

// Get all plants
router.get('/', (req, res) => {
    res.json(plantsData);
});

// Get plant by ID
router.get('/:id', (req, res) => {
    const plantId = parseInt(req.params.id);
    const plant = plantsData.find(p => p.id === plantId);

    if (!plant) {
        return res.status(404).json({ error: 'Plant not found' });
    }

    res.json(plant);
});

// Analyze plant image via Gemini 2.5 Flash
router.post('/analyze', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded' });
    }

    try {
        const base64Image = req.file.buffer.toString('base64');
        const mimeType = req.file.mimetype;

        const prompt = `
            You are a botanical expert. Analyze the provided image of a plant.
            Identify the plant and provide the following information in strict JSON format:
            {
                "plantName": "Primary common name of the plant",
                "confidence": "A number between 0 and 1 indicating how confident you are (e.g. 0.95)",
                "description": "A brief 1-2 sentence description of the plant",
                "category": "e.g., Tropical, Succulent, Fern, Houseplant",
                "careLevel": "e.g., Very Easy, Easy, Moderate, Hard",
                "water": "Brief watering instructions",
                "light": "Brief lighting requirements"
            }
            Do not include any Markdown formatting like \`\`\`json, just output the raw JSON string.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                prompt,
                {
                    inlineData: {
                        data: base64Image,
                        mimeType: mimeType
                    }
                }
            ]
        });

        const reply = response.text || response.candidates?.[0]?.content?.parts?.[0]?.text;
        
        let jsonResult;
        try {
            // Attempt to clean up the output if Gemini wraps it in markdown despite instructions
            const cleanedReply = reply.replace(/```json/g, '').replace(/```/g, '').trim();
            jsonResult = JSON.parse(cleanedReply);
        } catch (e) {
            console.error('Error parsing Gemini response as JSON:', reply);
            return res.status(500).json({ error: 'Failed to parse AI response' });
        }

        res.json(jsonResult);

    } catch (error) {
        console.error('Gemini API error:', error.message);
        res.status(500).json({ error: 'Failed to analyze image' });
    }
});

module.exports = router;
