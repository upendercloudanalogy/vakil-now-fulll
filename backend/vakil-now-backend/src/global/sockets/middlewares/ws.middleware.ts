// src/notifications/middlewares/ws.middleware.ts
import { JwtService } from "@nestjs/jwt";
import { Socket } from "socket.io";
import { MySqlDatabase } from 'drizzle-orm/mysql-core';
import { schema } from 'src/db/schema';
import { eq } from 'drizzle-orm';

interface AuthenticatedSocket extends Socket {
    userId: string;
    userRole: string;
}

export const SocketAuthMiddleware = (
    jwtService: JwtService,
    db: MySqlDatabase<any, any>
): any => {
    return async (client: AuthenticatedSocket, next: any) => {
        try {
            const { cookie } = client.handshake.headers;
            if (!cookie) return next(new Error('Unauthorized: No cookies found'));

            // 1. Extract both tokens from the cookie string
            const token = cookie.split('; ').find(r => r.trim().startsWith('access-token='))?.split('=')[1];
            const userTypeInCookies = cookie.split('; ').find(r => r.trim().startsWith('user-type='))?.split('=')[1];

            console.log({token,userTypeInCookies}, 't&utc');
            
            if (!token || !userTypeInCookies) {
                return next(new Error('Unauthorized: Tokens missing'));
            }

            // 2. Verify Access Token
            const payload = await jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });

            // 3. Verify User Type Token (matching your AuthGuard logic)
            const typePayload = await jwtService.verifyAsync(userTypeInCookies, {
                secret: process.env.JWT_SECRET,
            });

            // 4. DB Check (The "Vakil-Now" specific validation)
            const [userData] = await db
                .select({ type: schema.users.type })
                .from(schema.users)
                .where(eq(schema.users.id, payload.sub));

            if (!userData || userData.type !== typePayload.type) {
                return next(new Error('Invalid or expired token session'));
            }

            // 5. Successful Auth: Attach to socket object
            client.userId = payload.sub;
            client.userRole = userData.type;

            next();
        } catch (error) {
            console.error('Socket Auth Error =:', error);
            next(new Error('Invalid or expired token'));
        }
    };
};