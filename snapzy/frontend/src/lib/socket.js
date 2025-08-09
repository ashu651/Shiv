import { io } from 'socket.io-client';

let socket = null;

export function getSocket(token) {
  if (socket && socket.connected) return socket;
  socket = io(import.meta.env.VITE_API_URL?.replace('/api', '' ) || 'http://localhost:5000', {
    transports: ['websocket'],
    autoConnect: false,
    auth: { token },
  });
  socket.connect();
  return socket;
}

export function closeSocket() {
  if (socket) socket.disconnect();
  socket = null;
}