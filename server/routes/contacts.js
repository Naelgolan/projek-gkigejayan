const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');

// Submit a contact message (Public)
router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const newContact = await Contact.create({ name, email, message });
        res.status(201).json({ message: "Pesan Anda telah diterima. Terima kasih!", data: newContact });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all contact messages (Admin Protected)
router.get('/', auth, async (req, res) => {
    try {
        const messages = await Contact.findAll({ order: [['createdAt', 'DESC']] });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a contact message (Admin Protected)
router.delete('/:id', auth, async (req, res) => {
    try {
        const contact = await Contact.findByPk(req.params.id);
        if (!contact) return res.status(404).json({ message: 'Pesan tidak ditemukan' });
        await contact.destroy();
        res.json({ message: 'Pesan berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
