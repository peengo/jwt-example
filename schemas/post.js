const Joi = require('@hapi/joi');

const title = Joi.string()
    .min(3)
    .max(50)
    .required();

module.exports.titleConstraint = Joi.object({ title });

const body = Joi.string()
    .min(3)
    .max(500)
    .required();

module.exports.bodyConstraint = Joi.object({ body });

module.exports.postSchema = Joi.object({
    title,
    body
});
