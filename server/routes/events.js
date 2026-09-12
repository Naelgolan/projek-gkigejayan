const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');

// Get all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.findAll({ order: [['order', 'ASC'], ['createdAt', 'DESC']] });
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create event (Protected)
router.post('/', auth, async (req, res) => {
    try {
        const event = await Event.create(req.body);
        if (req.io) req.io.emit('data_updated', { type: 'events' });
        res.status(201).json(event);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update event (Protected)
router.put('/:id', auth, async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        await event.update(req.body);
        if (req.io) req.io.emit('data_updated', { type: 'events' });
        res.json(event);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete event (Protected)
router.delete('/:id', auth, async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        await event.destroy();
        if (req.io) req.io.emit('data_updated', { type: 'events' });
        res.json({ message: 'Event deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
