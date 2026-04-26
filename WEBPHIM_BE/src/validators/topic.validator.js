const Joi = require('joi');


// ==========================
// CREATE TOPIC
// ==========================
const createTopicSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required()
        .messages({
            'string.empty': 'Tên chủ đề không được để trống!',
            'string.min': 'Tên phải có ít nhất 2 ký tự!',
            'string.max': 'Tên tối đa 100 ký tự!',
            'any.required': 'Vui lòng nhập tên chủ đề!'
        })
});

// ==========================
// UPDATE TOPIC
// ==========================
const updateTopicSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required()
        .messages({
            'string.empty': 'Tên chủ đề không được để trống!',
            'string.min': 'Tên phải có ít nhất 2 ký tự!',
            'string.max': 'Tên tối đa 100 ký tự!',
            'any.required': 'Vui lòng nhập tên chủ đề!'
        })
});

module.exports = {
    createTopicSchema,
    updateTopicSchema
};