const Joi = require('joi');

// TOGGLE USER LOCK
const toggleUserLockSchema = Joi.object({
    is_locked: Joi.boolean().required()
        .messages({
            'any.required': 'Thiếu trạng thái khóa!',
            'boolean.base': 'is_locked phải là true hoặc false'
        }),

    lock_reason: Joi.string()
        .max(255)
        .when('is_locked', {
            is: true,
            then: Joi.required().messages({
                'any.required': 'Vui lòng nhập lý do khóa tài khoản!'
            }),
            otherwise: Joi.optional().allow(null, '')
        })
});

// PARAM ID (rất nên có)
const accountIdParamSchema = Joi.object({
    id: Joi.number().integer().required()
        .messages({
            'any.required': 'Thiếu ID tài khoản!',
            'number.base': 'ID phải là số'
        })
});

module.exports = {
    toggleUserLockSchema,
    accountIdParamSchema
};