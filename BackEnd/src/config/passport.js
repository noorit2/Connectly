import passport from "passport";
import { Strategy } from "passport-local";
import { userModel } from "../models/userModel.js";
import bcrypt from "bcrypt";

// Configure the local strategy
passport.use("local",
    new Strategy({
        passwordField:'password',
        usernameField:'email'
    },
    async (email, password, done) => {
        try {
            const user = await userModel.findUserByEmail(email);

            if (!user) {
                return done(null, false, { message: 'No user found' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return done(null, false, { message: 'Incorrect password' });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

// Serialize user into the session
passport.serializeUser((user, done) => {
    
    done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await userModel.getUserById(id);
        
        done(null, user);
    } catch (error) {
        done(error);
    }
});

export default passport;
