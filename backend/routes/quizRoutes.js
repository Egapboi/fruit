const express = require('express');
const router = express.Router();
const questionsData = require('../data/questions.json');
const { getDatabase } = require('../database');

// Get generic quiz questions
router.get('/', (req, res) => {
    // In a real app, you might want to randomize these or pick mock ones
    res.json(questionsData);
});

// Submit quiz score
// Expected body: { userId: 1, score: 5 }
router.post('/submit', async (req, res) => {
    const { userId, score } = req.body;
    if (!userId || score === undefined) {
        return res.status(400).json({ error: 'userId and score are required' });
    }

    const db = getDatabase();
    try {
        // Record the attempt
        await db.run(
            'INSERT INTO progress (user_id, quiz_score) VALUES (?, ?)',
            [userId, score]
        );

        res.json({ message: 'Score submitted successfully', score });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user progress
router.get('/progress/:userId', async (req, res) => {
    const userId = req.params.userId;
    const db = getDatabase();
    try {
        const rows = await db.all('SELECT * FROM progress WHERE user_id = ? ORDER BY last_quiz_date DESC', [userId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
