const express = require('express');
const router = express.Router();
const OfficeInfo = require('../models/OfficeInfo');
const auth = require('../middleware/auth');

// Get office info (or create default single row if empty)
router.get('/', async (req, res) => {
    try {
        let info = await OfficeInfo.findOne();
        if (!info) {
            info = await OfficeInfo.create({});
        }
        res.json(info);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update office info (Protected)
router.put('/', auth, async (req, res) => {
    try {
        let info = await OfficeInfo.findOne();
        if (!info) {
            info = await OfficeInfo.create(req.body);
        } else {
            await info.update(req.body);
        }
        if (req.io) req.io.emit('data_updated', { type: 'office-info' });
        res.json(info);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
