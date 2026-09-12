const express = require('express');
const router = express.Router();
const Pastor = require('../models/Pastor');
const auth = require('../middleware/auth');

// Get all pastors
router.get('/', async (req, res) => {
    try {
        const pastors = await Pastor.findAll({ order: [['order', 'ASC']] });
        res.json(pastors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a pastor (Protected)
router.post('/', auth, async (req, res) => {
    try {
        const pastor = await Pastor.create(req.body);
        if (req.io) req.io.emit('data_updated', { type: 'pastors' });
        res.status(201).json(pastor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a pastor (Protected)
router.put('/:id', auth, async (req, res) => {
    try {
        const pastor = await Pastor.findByPk(req.params.id);
        if (!pastor) return res.status(404).json({ message: 'Pastor not found' });
        
        await pastor.update(req.body);
        if (req.io) req.io.emit('data_updated', { type: 'pastors' });
        res.json(pastor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a pastor (Protected)
router.delete('/:id', auth, async (req, res) => {
    try {
        const pastor = await Pastor.findByPk(req.params.id);
        if (!pastor) return res.status(404).json({ message: 'Pastor not found' });
        
        await pastor.destroy();
        if (req.io) req.io.emit('data_updated', { type: 'pastors' });
        res.json({ message: 'Pastor deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
