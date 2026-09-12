const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff');
const auth = require('../middleware/auth');

// Get all staff
router.get('/', async (req, res) => {
    try {
        const staff = await Staff.findAll({ order: [['order', 'ASC'], ['id', 'ASC']] });
        res.json(staff);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create staff (Protected)
router.post('/', auth, async (req, res) => {
    try {
        const member = await Staff.create(req.body);
        if (req.io) req.io.emit('data_updated', { type: 'staff' });
        res.status(201).json(member);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update staff (Protected)
router.put('/:id', auth, async (req, res) => {
    try {
        const member = await Staff.findByPk(req.params.id);
        if (!member) return res.status(404).json({ message: 'Staff member not found' });
        
        await member.update(req.body);
        if (req.io) req.io.emit('data_updated', { type: 'staff' });
        res.json(member);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete staff (Protected)
router.delete('/:id', auth, async (req, res) => {
    try {
        const member = await Staff.findByPk(req.params.id);
        if (!member) return res.status(404).json({ message: 'Staff member not found' });
        
        await member.destroy();
        if (req.io) req.io.emit('data_updated', { type: 'staff' });
        res.json({ message: 'Staff member deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
