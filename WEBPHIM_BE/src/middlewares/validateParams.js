const { appError } = require('../utils/appError');

const validateParams = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.params, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            console.log("ở đây");
            const message = error.details.map(e => e.message).join(', ');
            return next(new appError(message, 400));
        }

        req.params = value;

        next();
    };
};

module.exports = validateParams;