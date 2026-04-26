const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Bạn chưa đăng nhập!'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET, {
            issuer: 'webphim-api',
            audience: 'webphim-client'
        });

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token không hợp lệ hoặc đã hết hạn!'
        });
    }
};

const isAdmin = (req, res, next) => {
    const role = req.user?.role?.toUpperCase();

    if (role === 'ADMIN') {
        return next();
    }

    return res.status(403).json({
        success: false,
        message: "Bạn không phải Admin!"
    });
};

module.exports = {
    verifyToken,
    isAdmin
};