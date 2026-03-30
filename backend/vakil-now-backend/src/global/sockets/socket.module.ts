// src/notifications/notification.module.ts
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'; // <--- Add this
import { SocketsGateway } from './socket.gateway';
import { SocketService } from './socket.service';
import { DrizzleModule } from 'src/drizzle/drizzle.module';

@Global()
@Module({
    imports: [
        DrizzleModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'SECRET_KEY',
        }),
    ],
    providers: [SocketsGateway, SocketService],
    exports: [SocketService, SocketsGateway],
})
export class SocketModule { }