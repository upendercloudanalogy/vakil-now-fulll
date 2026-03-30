import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { UserModule } from '../user/user.module';
import { EmailModule } from 'src/global/email/email.module';


@Module({

  imports: [
    UserModule,
    EmailModule,
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET || 'SECRET_KEY',
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRY as any || '15m' },
    }),
    DrizzleModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule { }
