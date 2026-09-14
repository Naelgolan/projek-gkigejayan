const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    let token = req.header('x-auth-token');

    if (!token && req.header('authorization')) {
        const authHeader = req.header('authorization');
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        } else {
            token = authHeader;
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'gkigejayan_secret_key');
        req.admin = decoded.admin;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
