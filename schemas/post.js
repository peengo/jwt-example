const Joi = require('@hapi/joi');

module.exports.postSchema = Joi.object({
    title: Joi.string()
        .min(3)
        .max(50),

    body: Joi.string()
        .min(3)
        .max(500)
});
