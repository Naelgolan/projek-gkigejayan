const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// @route   POST api/auth/login
// @desc    Auth admin & get token
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let admin = await Admin.findOne({ where: { email } });

        if (!admin) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const isMatch = await admin.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const payload = {
            admin: {
                id: admin.id,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'gkigejayan_secret_key',
            { expiresIn: '1d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, admin: { id: admin.id, email: admin.email } });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
