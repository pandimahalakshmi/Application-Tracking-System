import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
  const frontendEnvOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  const socketAllowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    ...frontendEnvOrigins,
  ];

  io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (socketAllowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
          return callback(null, true);
        }
        callback(new Error(`Socket CORS blocked: ${origin}`));
      },
      credentials: true,
    },
  });
  io.on('connection', (socket) => {
    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(` 🔌 User ${userId} joined`);
    });
    socket.on('disconnect', () => console.log(' 🔌 Client disconnected'));
  });
  return io;
};

export const getIO = () => io;
