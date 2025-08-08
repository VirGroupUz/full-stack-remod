const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

const authenticateAdmin = (req, res, next) => {
    authenticate(req, res, () => {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
        next();
    });
};

module.exports = { authenticate, authenticateAdmin };