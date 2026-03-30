import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../../decorators/public.decorator';
import { DrizzleAsyncProvider } from 'src/drizzle/drizzle.provider';
import { MySqlDatabase } from 'drizzle-orm/mysql-core';
import { schema } from 'src/db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    @Inject(DrizzleAsyncProvider) private readonly db: MySqlDatabase<any, any>,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If route is public, allow access without token
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
  
    const headetrAuthorization = request.headers['authorization'];
    const token = this.extractToken(request);
    const userTypeInCookies = request.cookies?.['user-type'];// IMPORTANT

    const path = context.switchToHttp().getRequest().path; // if you want manually sees path and then checks public or not..
    if (!token) {
      throw new UnauthorizedException('Access token is requiredsssss');
    }


    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      const type = await this.jwtService.verifyAsync(userTypeInCookies, {
        secret: process.env.JWT_SECRET,
      });

      //checking for user-type
      const [userData] = await this.db
        .select({
          type: schema.users.type
        })
        .from(schema.users)
        .where(eq(schema.users.id, payload?.sub));

      if (userData.type !== type?.type) {
        throw new UnauthorizedException('Invalid or expired token');
      }
      // Attach user payload to the request object
      request.userId = payload?.sub;


      // console.log(request.userId , 'in middlewatre');
      

    } catch (error) {      
      throw new UnauthorizedException('Invalid or expired token');
    }
    return true;
  }

  private extractToken(request: Request): string | undefined {
    // 1. Read from Authorization header
    const authHeader = request.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      return authHeader.split(" ")[1];
    }

    // 2. Read from HttpOnly cookie
    const token = request.cookies?.['access-token'];// IMPORTANT
    if (token) return token;

    return undefined;
  }
}