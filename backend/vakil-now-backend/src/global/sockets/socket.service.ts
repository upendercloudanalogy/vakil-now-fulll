// src/global/sockets/socket.service.ts
import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class SocketService {
    // Hataya: @WebSocketServer() 
    public server: Server;

    emitToUser (userId: string, event: string, payload: any) {
        if (!this.server) {
            return console.error('❌ SocketService: Server instance not yet initialized!');
        }
        this.server.to(`user_${userId}`).emit(event, payload);
    }

    emitToRole (role: string, event: string, payload: any) {
        if (!this.server) return;
        this.server.to(role).emit(event, payload);
    }

    emitToAll (event: string, payload: any) {
        if (!this.server) return;
        this.server.emit(event, payload);
    }
}