const appError = require('../utils/appError');

const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const message = error.details.map(e => e.message).join(', ');
            return res.status(400).json({
                success: false,
                message: message // Hiển thị nguyên câu tiếng Việt bạn đã viết trong Joi
            });
        }

        req.body = value;

        next();
    };
};

module.exports = validate;