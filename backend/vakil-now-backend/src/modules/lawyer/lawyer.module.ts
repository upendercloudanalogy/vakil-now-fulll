import { Module } from '@nestjs/common';
import { LawyerService } from './lawyer.service';
import { LawyerController } from './lawyer.controller';
import { UploadModule } from 'src/global/upload/upload.module';
import { DrizzleModule } from 'src/drizzle/drizzle.module'; // <-- ADD THIS

@Module({
    imports: [UploadModule, DrizzleModule], // <-- REQUIRED
    providers: [LawyerService],
    controllers: [LawyerController],
})
export class LawyerModule { }
