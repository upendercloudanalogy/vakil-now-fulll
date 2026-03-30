import { Module } from '@nestjs/common';
import { LLPService } from './llp-registration.service';
import { LLPController } from './llp-registration.controller';
import { UploadModule } from 'src/global/upload/upload.module';
import { DrizzleModule } from 'src/drizzle/drizzle.module'; // <-- ADD THIS

@Module({
  imports: [UploadModule, DrizzleModule], // <-- REQUIRED
  providers: [LLPService],
  controllers: [LLPController],
})
export class LlpRegistrationModule {}
