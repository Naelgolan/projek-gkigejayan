const express = require('express');
const router = express.Router();
const Schedule = require('../models/Schedule');
const auth = require('../middleware/auth');

// Get all schedules
router.get('/', async (req, res) => {
    try {
        const schedules = await Schedule.findAll({
            order: [['order', 'ASC'], ['id', 'ASC']]
        });
        res.json(schedules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a schedule (Protected)
router.post('/', auth, async (req, res) => {
    try {
        const schedule = await Schedule.create(req.body);
        if (req.io) req.io.emit('data_updated', { type: 'schedules' });
        res.status(201).json(schedule);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a schedule (Protected)
router.put('/:id', auth, async (req, res) => {
    try {
        const schedule = await Schedule.findByPk(req.params.id);
        if (!schedule) return res.status(404).json({ message: 'Schedule not found' });
        
        await schedule.update(req.body);
        if (req.io) req.io.emit('data_updated', { type: 'schedules' });
        res.json(schedule);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a schedule (Protected)
router.delete('/:id', auth, async (req, res) => {
    try {
        const schedule = await Schedule.findByPk(req.params.id);
        if (!schedule) return res.status(404).json({ message: 'Schedule not found' });
        
        await schedule.destroy();
        if (req.io) req.io.emit('data_updated', { type: 'schedules' });
        res.json({ message: 'Schedule deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
