import { Module  } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DrizzleModule } from './drizzle/drizzle.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { CacheModule } from '@nestjs/cache-manager';
import {APP_GUARD} from '@nestjs/core';
import { AuthGuard } from './modules/auth/guards/authGuard/auth.guard';
import { GlobalModule } from './global/global.module';


@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: '.env',
    isGlobal: true,
  }),
  CacheModule.register({
    isGlobal: true,
    ttl:300
  }),
  DrizzleModule,
  AuthModule,
  UserModule,
  GlobalModule],
  controllers: [AppController],
  providers: [{
    provide: APP_GUARD,
    useClass: AuthGuard,
  },
    AppService],
})
export class AppModule {}
