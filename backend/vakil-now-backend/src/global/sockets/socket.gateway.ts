import { Inject, UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as websockets from "@nestjs/websockets";
import { MySqlDatabase } from 'drizzle-orm/mysql-core';
import { Server, Socket } from 'socket.io';
import { DrizzleAsyncProvider } from 'src/drizzle/drizzle.provider';
import { WsGuard } from "./guards/ws.guard";
import { SocketAuthMiddleware } from "./middlewares/ws.middleware";
import { SocketService } from "./socket.service";

interface AuthenticatedSocket extends Socket {
    userId: string;
    userRole: string;
}

@websockets.WebSocketGateway({
    cors: {
        origin: ["http://localhost:3000", "http://yamanote.proxy.rlwy.net:19635"],
        methods: ["GET", "POST"],
        credentials: true, // Fixed typo: 'credentials' instead of 'Credential'
    },
    pingTimeout: 600,
    maxHttpBufferSize: 1e8,
    transports: ['websocket', 'polling'],
})
export class SocketsGateway implements websockets.OnGatewayConnection, websockets.OnGatewayDisconnect, websockets.OnGatewayInit {
    @websockets.WebSocketServer() server: Server;

    constructor (private jwtService: JwtService,
        @Inject(DrizzleAsyncProvider) private readonly db: MySqlDatabase<any, any>,
        private readonly socketService: SocketService
    ) { }

    afterInit (server: Server) {
        this.socketService.server = server;
        server.use(SocketAuthMiddleware(this.jwtService, this.db));
    }

    // Uses AuthenticatedSocket to avoid TS errors
    handleConnection (client: AuthenticatedSocket) {
        const userId = client.userId;
        const role = client.userRole;
        if (userId) {
            // 1. Private Room for individual sync
            client.join(`user_${userId}`);
            // 2. Role-based Rooms for broadcasting to specific groups
            if (role === 'ADMIN') {
                client.join('ADMIN');
            } else if (role === 'LAWYER') {
                client.join('LAWYERS'); // Sab lawyers ke liye
            } else if (role === 'USER') {
                client.join('USERS'); // Sab customers ke liye
            }
        }
        console.log(`✅ User ${userId} (${role}) joined [user_${userId}] and [${role}] group`);
    }

    // Required to satisfy OnGatewayDisconnect
    handleDisconnect (client: AuthenticatedSocket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @UseGuards(WsGuard) // Now you can use the guard on specific events
    @websockets.SubscribeMessage('ping')
    handlePing (client: AuthenticatedSocket): websockets.WsResponse<string> {
        return { event: 'pong', data: 'Server is alive!' };
    }
}