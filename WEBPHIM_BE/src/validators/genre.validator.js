const Joi = require('joi');

// CREATE GENRE
const createGenreSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required()
        .messages({
            'string.empty': 'Tên thể loại không được để trống!',
            'string.min': 'Tên phải có ít nhất 2 ký tự!',
            'any.required': 'Vui lòng nhập tên thể loại!'
        })
});

// UPDATE GENRE
const updateGenreSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required()
        .messages({
            'string.empty': 'Tên thể loại không được để trống!',
            'string.min': 'Tên phải có ít nhất 2 ký tự!',
            'any.required': 'Vui lòng nhập tên thể loại!'
        })
});

module.exports = {
    createGenreSchema,
    updateGenreSchema
};