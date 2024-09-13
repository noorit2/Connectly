import express, { Request, Response, NextFunction } from "express";
import passport, { User } from "../config/passport";
import { 
    createConnection, 
    createUser, 
    getAllUsers, 
    getUnconnectedUserWithLimitAndOffset, 
    getUserByIdWithCommunitiesAndConnectionsCount, 
    getconnectedUserWithLimitAndOffset, 
    setConnectionStatus 
} from "../controllers/userController";
import { ensureAuthenticated } from "../middlewares/authMiddleware";

const router = express.Router(); 

// Signin route
router.post('/signin', (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);

    passport.authenticate('local', (err: any, user: User, info: any) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        req.logIn(user, (err: any) => {
            if (err) {
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            return res.status(201).json({ message: 'Authenticated successfully', user });
        });
    })(req, res, next);
});

// Check Authentication
router.post('/checkAuth', (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
        return res.status(200).json({ message: 'Authenticated successfully' });
    } else {
        return res.status(403).json({ error: 'Not authorized' });
    }
});

// Sign out route
router.get('/signout', (req: Request, res: Response, next: NextFunction) => {
    req.logout((err: any) => {
        if (err) {
            return next(err);
        }
        res.status(201).json({ message: 'Successfully signed out' });
    });
});

// Other user-related routes
router.post('/createConnection', ensureAuthenticated, createConnection);
router.post('/setConnectionStatus', ensureAuthenticated, setConnectionStatus);
router.post('/', createUser);
router.get("/", ensureAuthenticated, getUnconnectedUserWithLimitAndOffset);
router.get("/:userId/connections", ensureAuthenticated, getconnectedUserWithLimitAndOffset);
router.get("/:userId", ensureAuthenticated, getUserByIdWithCommunitiesAndConnectionsCount);

export const userRoutes = router;
