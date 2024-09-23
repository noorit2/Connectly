// src/app.ts
import express, { Application } from 'express';
import session from 'express-session';
import passport from './config/passport';
import uid from 'uid-safe';
import bodyParser from 'body-parser';
import cors from 'cors';
import pgSession from 'connect-pg-simple';
import { pool } from './config/db';
import { userRoutes } from './routes/userRoutes';
import { errorHandler } from './middlewares/errorMiddleware';
import { communityRoutes } from './routes/communityRoutes';

// Initialize Express app
 const app: Application = express();
const PgSession = pgSession(session);

// Define session store
const sessionStore = new PgSession({
  pool: pool,
  tableName: 'session'
});


// Define session configuration
const sessionMiddleware = session({
  genid: () => uid.sync(18),
  secret: process.env.SESSION_SECRET || 'defaultSecret',
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 12
  }
});

// Apply middlewares
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['POST', 'GET']
}));

app.use(sessionMiddleware);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// Register routes
app.use('/users', userRoutes);
app.use('/communities', communityRoutes);

// Error handling middleware
app.use(errorHandler);

export default app;
export { sessionMiddleware, app };
