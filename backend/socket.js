import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
  io = new Server(server, { cors: { origin: '*' } });
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
