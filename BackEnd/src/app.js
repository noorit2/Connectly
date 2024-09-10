import express from "express";
import session from "express-session";
import passport from "./config/passport.js";
import uid from "uid-safe";
import { userRoutes } from "./routes/userRoutes.js";
import { errorMD } from "./middlewares/errorMiddleware.js";
import bodyParser from "body-parser";
import cors from "cors";
import pgSession from 'connect-pg-simple';
import { pool } from "./config/db.js";
import { communityRoutes } from "./routes/communityRoutes.js";

const app = express();
const PgSession = pgSession(session);
 
const sessionStore = new PgSession({
  pool: pool, // Replace with your PostgreSQL pool
  tableName: 'session' // N
});


app.use(cors({
    origin: ['http://localhost:3000'], 
    credentials: true, 
    optionsSuccessStatus: 200,
    methods: ["POST","GET"]
}));

const genUID =  ()=>{
    return uid.sync(18);
  }
  export const expressSession =   session({
    genid:  function(req){
      return genUID();
    },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60* 12
       // Cookie expiration (e.g., 24 hours)
  }
  });

app.use(expressSession);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

// Register routes
app.use('/users', userRoutes);
app.use("/communities", communityRoutes)
// Error handling middleware
app.use(errorMD);

export default app;
