const express = require('express');
const router = express.Router();
const FooterBlock = require('../models/FooterBlock');
const auth = require('../middleware/auth');

// Get all footer blocks
router.get('/', async (req, res) => {
    try {
        const blocks = await FooterBlock.findAll({ order: [['order', 'ASC']] });
        res.json(blocks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create footer block
router.post('/', auth, async (req, res) => {
    try {
        const block = await FooterBlock.create(req.body);
        res.status(201).json(block);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update footer block
router.put('/:id', auth, async (req, res) => {
    try {
        const block = await FooterBlock.findByPk(req.params.id);
        if (!block) return res.status(404).json({ message: 'Footer block not found' });
        await block.update(req.body);
        res.json(block);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete footer block
router.delete('/:id', auth, async (req, res) => {
    try {
        const block = await FooterBlock.findByPk(req.params.id);
        if (!block) return res.status(404).json({ message: 'Footer block not found' });
        await block.destroy();
        res.json({ message: 'Footer block deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
