const Joi = require('joi');

const createMovieSchema = Joi.object({
    title: Joi.string().trim().max(255).required(),
    orignal_title: Joi.string().trim().max(255).allow('', null),
    description: Joi.string().allow('', null),
    type: Joi.string().valid('Series', 'Single').required(),
    release_year: Joi.date().required(),
    country: Joi.string().max(100).allow('', null),
    poster_url: Joi.string().uri().allow('', null),
    trailer_url: Joi.string().uri().allow('', null),
    age_rating: Joi.string().max(20).allow('', null),
    status: Joi.string().valid('ongoing', 'completed', 'upcoming').required()
});

//
// 🎬 UPDATE MOVIE
//
const updateMovieSchema = Joi.object({
    title: Joi.string().trim().max(255),
    orignal_title: Joi.string().trim().max(255).allow('', null),
    description: Joi.string().allow('', null),
    type: Joi.string().valid('Series', 'Single'),
    release_year: Joi.date(),
    country: Joi.string().max(100).allow('', null),
    poster_url: Joi.string().uri().allow('', null),
    trailer_url: Joi.string().uri().allow('', null),
    age_rating: Joi.number().precision(1).min(0).max(10).allow(null),
    status: Joi.string().valid('ongoing', 'completed', 'upcoming')
});

//
// 🎬 GENRE
//
const genreSchema = Joi.object({
    genre_ids: Joi.array()
        .items(Joi.number().integer().positive())
        .min(1)
        .required()
        .messages({
            'array.base': 'genre_ids phải là mảng',
            'array.min': 'Phải chọn ít nhất 1 thể loại'
        })
});

//
// 🎬 TOPIC
//
const topicSchema = Joi.object({
    topic_ids: Joi.array()
        .items(Joi.number().integer().positive())
        .required()
        .messages({
            'array.base': 'topic_ids phải là mảng'
        })
});

//
// 🎬 CREATE SEASON
//
const createSeasonSchema = Joi.object({
    season_number: Joi.number().integer().min(1).optional(),
    title: Joi.string().max(255).allow('', null),
    description: Joi.string().allow('', null)
});

//
// 🎬 CREATE EPISODE
//
const createEpisodeSchema = Joi.object({
    episode_number: Joi.number().integer().min(1).required(),
    title: Joi.string().max(255).required(),
    video_url: Joi.string().uri().required(),
    duration: Joi.number().integer().min(0).required()
});

//
// 🎬 UPDATE EPISODE
//
const updateEpisodeSchema = Joi.object({
    episode_number: Joi.number().integer().min(1),
    title: Joi.string().max(255).allow('', null),
    video_url: Joi.string().uri().allow('', null),
    duration: Joi.number().integer().min(0)
});

module.exports = {
    createMovieSchema,
    updateMovieSchema,
    genreSchema,
    topicSchema,
    createSeasonSchema,
    createEpisodeSchema,
    updateEpisodeSchema
};