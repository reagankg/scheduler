// src/plugins/socket.js
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_HOSTNAME || 'http://localhost:5000', {
  withCredentials: true
});

export default socket;
