// src/common/guards/ws.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Socket } from 'socket.io';


interface AuthenticatedSocket extends Socket {
    userId: string;
    userRole: string;
}

@Injectable()
export class WsGuard implements CanActivate {
    constructor (private reflector: Reflector) { }

    canActivate (context: ExecutionContext): boolean {
        const client: AuthenticatedSocket = context.switchToWs().getClient();

        // 1. Check if user was authenticated by the middleware
        if (!client.userId) {
            return false;
        }

        // 2. Role-Based Access Control (Optional)
        // You can check for @Roles('admin') metadata here
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) {
            return true; // If no roles are required, allow authorized users
        }

        return roles.includes(client.userRole);
    }
}