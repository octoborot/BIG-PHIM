const Joi = require('joi');

const updateEpisodeSchema = Joi.object({
    episode_number: Joi.number().integer().min(1),
    title: Joi.string().max(255).allow('', null),
    video_url: Joi.string().uri().allow('', null),
    duration: Joi.number().integer().min(0)
});

const createEpisodeSchema = Joi.object({
    episode_number: Joi.number().integer().min(1).required(),
    title: Joi.string().max(255).required(),
    video_url: Joi.string().uri().required(),
    duration: Joi.number().integer().min(0).required()
});

module.exports = {
    updateEpisodeSchema,
    createEpisodeSchema
};