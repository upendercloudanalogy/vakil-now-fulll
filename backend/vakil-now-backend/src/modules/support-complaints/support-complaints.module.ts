import { Module } from '@nestjs/common';
import { SupportComplaintsService } from './support-complaints.service';
import { SupportComplaintsController } from './support-complaints.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { UploadModule } from 'src/global/upload/upload.module';

@Module({
  imports:[DrizzleModule , UploadModule ],
  providers: [SupportComplaintsService],
  controllers: [SupportComplaintsController]
})
export class SupportComplaintsModule {}
