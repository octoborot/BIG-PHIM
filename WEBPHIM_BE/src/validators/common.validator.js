const Joi = require('joi');

const idSchema = Joi.number().integer().positive().required();

const paramId = (key) => Joi.object({
    [key]: idSchema
});

module.exports = {
    idSchema,
    paramId
};  