import { Request, Response, NextFunction } from 'express';

// Define the error-handling middleware with proper types
export const errorMD = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    console.error(err.stack);
    res.status(500).json({ message: err.message });
};
