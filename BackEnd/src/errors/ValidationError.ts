import Joi from 'joi';
import { CustomError } from './CustomError';

export class ValidationError extends CustomError {
    constructor(message: string = 'Invalid input', details?:Joi.ValidationErrorItem ) {
        super(message, 400, details);
    }
}