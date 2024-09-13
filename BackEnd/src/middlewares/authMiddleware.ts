import { Request, Response, NextFunction } from 'express';
import { User } from '../config/passport';


// Extend the Request interface to include user and isAuthenticated
interface AuthenticatedRequest extends Request {
    user: User ; // Ensure user is defined when authenticated
    isAuthenticated: () => this is AuthenticatedRequest;
}

// Middleware to ensure the user is authenticated
export function ensureAuthenticated(req: Request, res: Response, next: NextFunction): void {
    const authReq = req as AuthenticatedRequest;

    if (authReq.isAuthenticated()) {
        return next();
    }

    res.status(401).json({ error: 'Unauthorized' });
}
