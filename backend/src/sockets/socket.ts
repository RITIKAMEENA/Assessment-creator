import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { env } from '../config/env.js';

let io: Server;

export function initSocket(server: HttpServer) {
  io = new Server(server, {
    cors: { origin: env.clientUrl, methods: ['GET', 'POST'] }
  });

  io.on('connection', socket => {
    socket.on('join-assignment', assignmentId => {
      socket.join(`assignment:${assignmentId}`);
    });
  });

  return io;
}

export function notifyAssignment(assignmentId: string, payload: unknown) {
  if (io) io.to(`assignment:${assignmentId}`).emit('assignment-update', payload);
}
