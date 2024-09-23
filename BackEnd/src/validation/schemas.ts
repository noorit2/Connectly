import Joi from 'joi';

export const paginationSchema = Joi.object({
    limit: Joi.number().integer().min(0).default(10),
    offset: Joi.number().integer().min(0).default(0),
    searchWord: Joi.string().optional().allow(''),
}); 

export const createCommunitySchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).max(500).required(),
    file: Joi.object({
        mimetype: Joi.string().valid('image/jpeg', 'image/png').required(),
    }).optional(), // Optional file field for image
});
