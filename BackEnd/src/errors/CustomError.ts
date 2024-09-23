import { ValidationErrorItem } from "joi";

export class CustomError extends Error {
    public statusCode: number;
    public details?: ValidationErrorItem
    constructor(message: string, statusCode: number,details?:ValidationErrorItem) {
        super(message);
        this.statusCode = statusCode;
        this.details = details
        // Maintains proper stack trace (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }

        this.name = this.constructor.name;
    }
}