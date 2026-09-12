const express = require('express');
const router = express.Router();
const Ministry = require('../models/Ministry');
const auth = require('../middleware/auth');

// Get all ministries
router.get('/', async (req, res) => {
    try {
        const ministries = await Ministry.findAll();
        res.json(ministries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a ministry (Protected)
router.post('/', auth, async (req, res) => {
    try {
        const ministry = await Ministry.create(req.body);
        if (req.io) req.io.emit('data_updated', { type: 'ministries' });
        res.status(201).json(ministry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a ministry (Protected)
router.put('/:id', auth, async (req, res) => {
    try {
        const ministry = await Ministry.findByPk(req.params.id);
        if (!ministry) return res.status(404).json({ message: 'Ministry not found' });
        
        await ministry.update(req.body);
        if (req.io) req.io.emit('data_updated', { type: 'ministries' });
        res.json(ministry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a ministry (Protected)
router.delete('/:id', auth, async (req, res) => {
    try {
        const ministry = await Ministry.findByPk(req.params.id);
        if (!ministry) return res.status(404).json({ message: 'Ministry not found' });
        
        await ministry.destroy();
        if (req.io) req.io.emit('data_updated', { type: 'ministries' });
        res.json({ message: 'Ministry deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const Volunteer = require('../models/Volunteer');

// Register for a ministry (Public)
router.post('/register', async (req, res) => {
    try {
        const { fullName, email, ministryId } = req.body;
        // Verify ministry exists
        const ministry = await Ministry.findByPk(ministryId);
        if (!ministry) {
            return res.status(404).json({ message: 'Pelayanan tidak ditemukan' });
        }
        
        const newVolunteer = await Volunteer.create({ fullName, email, ministryId });
        res.status(201).json({ message: "Pendaftaran berhasil terkirim!", data: newVolunteer });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// List all volunteer registrations (Admin Protected)
router.get('/volunteers/list', auth, async (req, res) => {
    try {
        const volunteers = await Volunteer.findAll({
            include: [{ model: Ministry, attributes: ['title'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json(volunteers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a volunteer registration (Admin Protected)
router.delete('/volunteers/:id', auth, async (req, res) => {
    try {
        const volunteer = await Volunteer.findByPk(req.params.id);
        if (!volunteer) return res.status(404).json({ message: 'Pendaftaran tidak ditemukan' });
        await volunteer.destroy();
        res.json({ message: 'Pendaftaran berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
