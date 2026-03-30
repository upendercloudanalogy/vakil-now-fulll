import { Module } from '@nestjs/common';
import { DrizzleAsyncProvider, drizzleProvider } from './drizzle.provider';
import { ConfigService,ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [...drizzleProvider, ConfigService],
  exports: [DrizzleAsyncProvider],
})
export class DrizzleModule {}
