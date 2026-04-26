const Joi = require('joi');

// ADD FAVORITE
const addFavoriteSchema = Joi.object({
    movie_id: Joi.number().integer().required()
        .messages({
            'number.base': 'movie_id phải là số',
            'any.required': 'Thiếu movie_id'
        }),

    notes: Joi.string().max(255).allow('', null)
});

// SAVE WATCH HISTORY
const saveWatchHistorySchema = Joi.object({
    episode_id: Joi.number().integer().required()
        .messages({
            'any.required': 'Thiếu episode_id'
        }),

    progress_second: Joi.number().integer().min(0).required()
        .messages({
            'number.min': 'progress phải >= 0'
        }),

    is_completed: Joi.boolean().optional()
});

module.exports = {
    addFavoriteSchema,
    saveWatchHistorySchema
};