const Joi = require('@hapi/joi');

module.exports.userSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .invalid('self', 'admin'),

    password: Joi.string()
        .min(8)
        .max(30)
});
