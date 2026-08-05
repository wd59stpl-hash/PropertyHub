const Joi = require('joi');

exports.registerValidation = Joi.object({
    name: Joi.string().min(3).required().messages({
        'string.min': 'Name must be at least 3 characters long',
        'any.required': 'Name is required'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email',
        'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters long',
        'any.required': 'Password is required'
    }),
    role: Joi.string().valid('buyer', 'seller', 'admin').required()
});

exports.loginValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});