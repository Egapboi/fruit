const express = require('express');
const router = express.Router();
const plantsData = require('../data/plants.json');

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

module.exports = router;
