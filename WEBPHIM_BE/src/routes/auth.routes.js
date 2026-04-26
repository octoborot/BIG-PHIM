const express = require('express');
const authRoutes = express.Router();

const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate');
const { loginLimiter } = require('../middlewares/rateLimit');

const {
    registerSchema,
    loginSchema,
    changePasswordSchema
} = require('../validators/auth.validator');


// REGISTER
authRoutes.post(
    '/register',
    validate(registerSchema),
    authController.register
);

// LOGIN
authRoutes.post(
    '/login',
    loginLimiter,                 
    validate(loginSchema),     
    authController.login
);

// CHANGE PASSWORD
authRoutes.patch(
    '/change-password',
    verifyToken,                
    validate(changePasswordSchema),
    authController.changePassword
);

module.exports = authRoutes;