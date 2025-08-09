import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from './env.js';

let ioInstance = null;
const userIdToSocketIds = new Map();

export function initIo(httpServer) {
  ioInstance = new Server(httpServer, {
    cors: { origin: config.clientUrl, credentials: true },
  });

  ioInstance.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token || null;
      if (!token) return next(new Error('no auth'));
      const payload = jwt.verify(token, config.jwtSecret);
      socket.userId = payload.userId;
      next();
    } catch (e) {
      next(new Error('bad auth'));
    }
  });

  ioInstance.on('connection', (socket) => {
    const set = userIdToSocketIds.get(socket.userId) || new Set();
    set.add(socket.id);
    userIdToSocketIds.set(socket.userId, set);

    socket.on('disconnect', () => {
      const setNow = userIdToSocketIds.get(socket.userId) || new Set();
      setNow.delete(socket.id);
      if (setNow.size === 0) userIdToSocketIds.delete(socket.userId);
      else userIdToSocketIds.set(socket.userId, setNow);
    });
  });

  return ioInstance;
}

export function getIo() {
  if (!ioInstance) throw new Error('Socket.io not initialized');
  return ioInstance;
}

export function emitToUser(userId, event, payload) {
  if (!ioInstance) return;
  const set = userIdToSocketIds.get(String(userId));
  if (!set) return;
  for (const sid of set) {
    ioInstance.to(sid).emit(event, payload);
  }
}