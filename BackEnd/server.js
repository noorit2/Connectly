import app from "./src/app.js";
import { expressSession } from "./src/app.js";
import { Server } from 'socket.io';
import sharedsession from 'express-socket.io-session';

const PORT = 4000;

const expressServer = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const io = new Server(expressServer, {
    cors: {
        origin:["http://localhost:3000"]
    }
});

io.use(sharedsession(expressSession, {
    autoSave: true,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

export {io};