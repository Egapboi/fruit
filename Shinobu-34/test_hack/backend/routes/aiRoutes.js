const express = require('express');
const multer = require('multer');
const router = express.Router();

// Configure multer for memory storage (file not saved to disk)
const upload = multer({ storage: multer.memoryStorage() });

// Mock AI Classification Endpoint
router.post('/classify', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image file uploaded' });
    }

    // Simulate AI processing time
    setTimeout(() => {
        // Mock response
        // In a real scenario, you'd send req.file.buffer to an external AI API (like OpenAI Vision, Google Cloud Vision, etc.)
        const mockResult = {
            plantName: "Tomato",
            confidence: 0.98,
            description: "Based on the image, this appears to be a Tomato plant.",
            category: "Fruit (Botanical)"
        };

        res.json(mockResult);
    }, 1000);
});

module.exports = router;
