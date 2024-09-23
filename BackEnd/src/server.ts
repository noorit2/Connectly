// src/server.ts
import { app, sessionMiddleware } from './app';
import { Server } from 'socket.io';
import sharedsession from 'express-socket.io-session';
import cookieParser from 'cookie-parser';  // Import cookie-parser

const PORT = 4000;

// Start the Express server
const expressServer = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Initialize Socket.IO
const io = new Server(expressServer, {
  cors: {
    origin: ["http://localhost:3000"]
  }
});

// Use shared session middleware with Socket.IO
io.use(sharedsession(sessionMiddleware,    cookieParser(),        // cookie-parser middleware
{
  autoSave: true
}));

export { io };
