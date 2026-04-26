const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 phút
    max: 5, // tối đa 5 request
    message: {
        success: false,
        message: 'Bạn đã thử đăng nhập quá nhiều lần. Vui lòng thử lại sau!'
    },
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = {
    loginLimiter
};