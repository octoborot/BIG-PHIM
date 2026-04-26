const Joi = require('joi');

// REGISTER
const registerSchema = Joi.object({
    email: Joi.string().email().required()
        .messages({
            'string.email': 'Email không đúng định dạng!',
            'any.required': 'Vui lòng nhập email!'
        }),

    password: Joi.string().min(6).required()
        .messages({
            'string.min': 'Mật khẩu phải có ít nhất 6 ký tự!',
            'any.required': 'Vui lòng nhập mật khẩu!'
        }),

    display_name: Joi.string().max(100).optional().allow(null, '')
        .messages({
            'string.max': 'Tên hiển thị tối đa 100 ký tự'
        })
});


// LOGIN
const loginSchema = Joi.object({
    email: Joi.string().email().required()
        .messages({
            'string.email': 'Email không đúng định dạng!',
            'any.required': 'Vui lòng nhập email!'
        }),

    password: Joi.string().min(6).required()
        .messages({
            'string.min': 'Mật khẩu phải có ít nhất 6 ký tự!',
            'any.required': 'Vui lòng nhập mật khẩu!'
        })
});


// CHANGE PASSWORD
const changePasswordSchema = Joi.object({
    oldPassword: Joi.string().required()
        .messages({
            'any.required': 'Vui lòng nhập mật khẩu hiện tại!'
        }),

    newPassword: Joi.string().min(6).required()
        .messages({
            'string.min': 'Mật khẩu mới phải có ít nhất 6 ký tự!',
            'any.required': 'Vui lòng nhập mật khẩu mới!'
        }),

    confirmPassword: Joi.string().required()
        .messages({
            'any.required': 'Vui lòng xác nhận mật khẩu!'
        })
}).custom((value, helpers) => {
    if (value.newPassword !== value.confirmPassword) {
        return helpers.message('Mật khẩu xác nhận không khớp!');
    }
    return value;
});

module.exports = {
    registerSchema,
    loginSchema,
    changePasswordSchema
};