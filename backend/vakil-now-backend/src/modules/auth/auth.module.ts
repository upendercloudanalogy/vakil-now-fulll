import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { UserModule } from '../user/user.module';
import { EmailModule } from 'src/global/email/email.module';
import { AdminModule } from '../admin/admin.module';


@Module({

  imports: [
    UserModule,
    EmailModule,
    AdminModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'SECRET_KEY',
    }),
    DrizzleModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule { }
