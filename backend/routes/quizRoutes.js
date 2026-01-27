const express = require('express');
const router = express.Router();
const questionsData = require('../data/questions.json');
const { getDatabase } = require('../database');

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Get randomized quiz questions
// Query params: ?count=5 (default 5, max 10)
router.get('/', (req, res) => {
    const count = Math.min(Math.max(parseInt(req.query.count) || 5, 1), 10);
    const shuffled = shuffleArray(questionsData);
    const selected = shuffled.slice(0, count);
    res.json(selected);
});

// Submit quiz score
// Expected body: { userId: 1, score: 5, totalQuestions: 5 }
router.post('/submit', async (req, res) => {
    const { userId, score, totalQuestions } = req.body;
    if (!userId || score === undefined) {
        return res.status(400).json({ error: 'userId and score are required' });
    }

    const db = getDatabase();
    try {
        await db.run(
            'INSERT INTO progress (user_id, quiz_score, total_questions) VALUES (?, ?, ?)',
            [userId, score, totalQuestions || 5]
        );

        res.json({ message: 'Score submitted successfully', score, totalQuestions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user progress
router.get('/progress/:userId', async (req, res) => {
    const userId = req.params.userId;
    const db = getDatabase();
    try {
        const rows = await db.all(
            'SELECT * FROM progress WHERE user_id = ? ORDER BY last_quiz_date DESC LIMIT 10',
            [userId]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get leaderboard - top 10 best scores
router.get('/leaderboard', async (req, res) => {
    const db = getDatabase();
    try {
        const rows = await db.all(`
            SELECT 
                u.username,
                p.quiz_score as score,
                p.total_questions as totalQuestions,
                p.last_quiz_date as date,
                ROUND((p.quiz_score * 100.0 / COALESCE(p.total_questions, 5)), 1) as percentage
            FROM progress p
            JOIN users u ON p.user_id = u.id
            ORDER BY percentage DESC, p.quiz_score DESC, p.last_quiz_date ASC
            LIMIT 10
        `);

        // Add rank to each entry
        const leaderboard = rows.map((row, index) => ({
            rank: index + 1,
            ...row
        }));

        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
