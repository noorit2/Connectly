// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/CustomError';
import { NotFoundError } from '../errors/NotFoundError';
import { ValidationError } from '../errors/ValidationError';
import { logger } from '../utils/logger';

export const errorHandler = (error: unknown, req: Request, res: Response, next: NextFunction) => {
    // Default to 500 Internal Server Error
    let statusCode = 500;
    let message = 'Internal server error';
    let details = undefined;
    if (error instanceof CustomError) {
        console.log("custom error");
        
        // Handle custom errors
        statusCode = error.statusCode;
        message = error.message;
        if(error.details){
            console.log("logging error details")
            console.log(error.details);
            details = error.details;
        }
    } else if (error instanceof Error) {
        // Handle generic errors
        message = error.message;
    }

    logger.error({
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        url: req.url,
        method: req.method,
    });


    res.status(statusCode).json({
        message,
        ...(process.env.NODE_ENV !== 'production' && { stack: error instanceof Error ? error.stack : undefined }),
        ...(details && {details:details})
    });
};
