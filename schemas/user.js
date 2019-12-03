const Joi = require('@hapi/joi');

const username = Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required();

module.exports.usernameConstraint = Joi.object({ username });

const password = Joi.string()
    .min(8)
    .max(30)
    .required();

module.exports.passwordConstraint = Joi.object({ password });

module.exports.userSchema = Joi.object({
    username,
    password
});
