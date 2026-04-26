const Joi = require('joi');

// ==========================
// UPDATE SEASON
// ==========================
const updateSeasonSchema = Joi.object({
    season_number: Joi.number().integer().min(1).required()
        .messages({
            'number.base': 'season_number phải là số!',
            'number.integer': 'season_number phải là số nguyên!',
            'number.min': 'season_number phải >= 1!',
            'any.required': 'Thiếu season_number!'
        }),

    title: Joi.string().trim().min(1).max(255).required()
        .messages({
            'string.empty': 'Tiêu đề không được để trống!',
            'string.min': 'Tiêu đề phải có ít nhất 1 ký tự!',
            'string.max': 'Tiêu đề tối đa 255 ký tự!',
            'any.required': 'Thiếu title!'
        }),

    description: Joi.string().allow('', null).optional()
});

module.exports = {
    updateSeasonSchema
};