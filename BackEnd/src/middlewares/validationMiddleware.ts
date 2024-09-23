import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../errors/ValidationError'; // Assuming you're using a custom ValidationError class
import Joi from 'joi';

// Middleware to validate request
export const validateRequest = (schemas: { params?: Joi.ObjectSchema, body?: Joi.ObjectSchema, query?: Joi.ObjectSchema }) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Validate `params`
        if (schemas.params) {
            const { error } = schemas.params.validate(req.params);
            if (error) {
                return next(new ValidationError(error.details[0].message,error.details[0]));
            }
        }

        // Validate `body`
        if (schemas.body) {
            const { error } = schemas.body.validate(req.body);
            if (error) {
                return next(new ValidationError(error.details[0].message));
            }
        }

        // Validate `query` (if needed)
        if (schemas.query) {
            const { error } = schemas.query.validate(req.query);
            if (error) {
                return next(new ValidationError(error.details[0].message,error.details[0]));
            }
        }

        next();
    };
};
