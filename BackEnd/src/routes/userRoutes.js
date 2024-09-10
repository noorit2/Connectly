import express from "express";
import passport from "../config/passport.js";
import { createConnection, createUser, getAllUsers, getUnconnectedUserWithLimitAndOffset, getUserById, getUserByIdWithCommunitiesAndConnectionsCount, getconnectedUserWithLimitAndOffset, setConnectionStatus } from "../controllers/userController.js";
import { ensureAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router(); 
router.post('/signin', (req, res, next) => {
    console.log(req.body);
    
    passport.authenticate('local', (err, user, info) => {
        
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            return res.status(201).json({ message: 'Authenticated successfully', user:user });
        });
    })(req, res, next);
});
router.post('/checkAuth',(req,res)=>{
    if(req.isAuthenticated()){
        return res.status(200).json({ message: 'Authenticated successfully' });
    }else{
        
        return res.status(403).json({ error: 'not authorized' });
    }

})
// Sign out route
router.get('/signout', (req, res, next) => {
    req.logout((err) => {
        if (err) {            
            // Pass error to the next middleware (typically an error-handling middleware)
            return next(err);
        }
        // After successfully logging out, respond with a success status
        res.status(201).json({ message: 'Successfully signed out' });
    });
});
router.post('/createConnection',ensureAuthenticated,createConnection);
router.post('/setConnectionStatus',ensureAuthenticated,setConnectionStatus);
router.post('/', createUser);
router.get("/",ensureAuthenticated,getUnconnectedUserWithLimitAndOffset);
router.get("/:userId/connections",ensureAuthenticated,getconnectedUserWithLimitAndOffset);
router.get("/:userId",ensureAuthenticated,getUserByIdWithCommunitiesAndConnectionsCount);

export const userRoutes = router;
