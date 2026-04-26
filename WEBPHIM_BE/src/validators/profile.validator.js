const Joi = require('joi');

// ==========================
// CREATE PROFILE
// ==========================
const createProfileSchema = Joi.object({
    display_name: Joi.string().trim().min(2).max(50).required()
        .messages({
            'string.empty': 'Tên hiển thị không được để trống!',
            'string.min': 'Tên phải có ít nhất 2 ký tự!',
            'string.max': 'Tên tối đa 50 ký tự!',
            'any.required': 'Vui lòng nhập display_name!'
        }),

    gender: Joi.string().valid('Nam', 'Nữ', 'Không xác định').optional()
        .messages({
            'any.only': 'gender phải là Nam, Nữ hoặc Không xác định!'
        }),

    avatar_url: Joi.string().uri().optional()
        .messages({
            'string.uri': 'avatar_url phải là URL hợp lệ!'
        }),

    account_id: Joi.number().integer().positive().required()
        .messages({
            'number.base': 'account_id phải là số!',
            'number.integer': 'account_id phải là số nguyên!',
            'number.positive': 'account_id phải lớn hơn 0!',
            'any.required': 'Thiếu account_id!'
        })
});

// ==========================
// UPDATE MY PROFILE
// ==========================
const updateMyProfileSchema = Joi.object({
    display_name: Joi.string().trim().min(2).max(50),
    gender: Joi.string().valid('Nam', 'Nu', 'Kh_ng_x_c___nh'),
    avatar_url: Joi.string().uri()
}).min(1); // 👈 bắt buộc phải có ít nhất 1 field

module.exports = {
    createProfileSchema,
    updateMyProfileSchema
};