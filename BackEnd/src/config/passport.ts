import passport from 'passport';
import { Strategy as LocalStrategy, IStrategyOptions } from 'passport-local';
import { userModel } from '../models/userModel'; // Adjust the path if needed
import bcrypt from 'bcrypt';

// Define the User type if not already defined
export interface User {
  id: string;
  email: string;
  password: string;
}



// Configure the local strategy
const strategyOptions: IStrategyOptions = {
  usernameField: 'email',
  passwordField: 'password',
};

passport.use(new LocalStrategy(strategyOptions, async (email: string, password: string, done: Function) => {
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
}));

// Serialize user into the session
passport.serializeUser((user: User, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await userModel.getUserById(id);
    
    if (user) {
      done(null, user);
    } else {
      done(new Error('User not found'), undefined);
    }
  } catch (error) {
    done(error);
  }
});

export default passport;
