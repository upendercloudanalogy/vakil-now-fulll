import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DrizzleModule } from './drizzle/drizzle.module';
import { GlobalModule } from './global/global.module';
import { AdminController } from './modules/admin/admin.controller';
import { AdminModule } from './modules/admin/admin.module';
import { AdminService } from './modules/admin/admin.service';
import { AuthModule } from './modules/auth/auth.module';
import { AuthGuard } from './modules/auth/guards/authGuard/auth.guard';
import { LlpRegistrationModule } from './modules/llp-registration/llp-registration.module';
import { ServiceModule } from './modules/service/service.module';
import { SupportComplaintsModule } from './modules/support-complaints/support-complaints.module';
import { UserModule } from './modules/user/user.module';
import { SocketModule } from './global/sockets/socket.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { LawyerModule } from './modules/lawyer/lawyer.module';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: '.env',
    isGlobal: true,
  }),
  CacheModule.register({
    isGlobal: true,
    ttl: 300
  }),
    DrizzleModule,
    AuthModule,
    UserModule,
    GlobalModule,
    AdminModule,
    MulterModule,
    ServiceModule,
    SupportComplaintsModule,
    LlpRegistrationModule,
    AnnouncementsModule,
    SocketModule,
    LawyerModule],
  controllers: [AppController, AdminController],
  providers: [{
    provide: APP_GUARD,
    useClass: AuthGuard,
  },
    AppService,
    AdminService],
})
export class AppModule { }
