const {
    registerService,
    loginService,
    changePasswordService
} = require('../services/auth.service');

const asyncHandler = require('../middlewares/asyncHandler');

// REGISTER
const register = asyncHandler(async (req, res) => {
    const data = await registerService(req.body);

    res.json({
        success: true,
        data
    });
});

// LOGIN
const login = asyncHandler(async (req, res) => {
    const result = await loginService(req.body);

    res.json({
        success: true,
        token: result.token,
        expiresIn: process.env.JWT_EXPIRES_IN,
        data: result.user
    });
});

// CHANGE PASSWORD
const changePassword = asyncHandler(async (req, res) => {
    await changePasswordService(req.user.id, req.body);
    res.json({
        success: true,
        message: 'Đổi mật khẩu thành công!'
    });
});

module.exports = {
    register,
    login,
    changePassword
};