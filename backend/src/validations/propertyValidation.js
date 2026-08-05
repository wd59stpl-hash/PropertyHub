const Joi = require('joi');

exports.propertySchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    type: Joi.string().lowercase().valid('apartment', 'villa', 'plot', 'commercial', 'office', 'shop', 'studio').required(),
    category: Joi.string().lowercase().valid('sale', 'rent').required(),

    price: Joi.number().required(),
    area: Joi.number().required(),
    bedrooms: Joi.number().default(0),
    bathrooms: Joi.number().default(0),
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    pincode: Joi.string().required(),
    lng: Joi.number().min(-180).max(180).required().messages({
        'number.min': 'Longitude must be between -180 and 180',
        'number.max': 'Longitude must be between -180 and 180'
    }),
    lat: Joi.number().min(-90).max(90).required().messages({
        'number.min': 'Latitude must be between -90 and 90',
        'number.max': 'Latitude must be between -90 and 90'
    }),
    furnishedStatus: Joi.string()
        .lowercase()
        .valid('unfurnished', 'semi', 'fully')
        .required(),

    amenities: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()),
}).unknown(true);