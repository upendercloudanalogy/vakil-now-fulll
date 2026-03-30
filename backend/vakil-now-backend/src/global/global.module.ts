import { Module } from '@nestjs/common';

import { AwsS3Module } from './aws-s3/aws-s3.module';
import { UploadModule } from './upload/upload.module';
import { UploadService } from './upload/upload.service';

@Module({
  imports: [AwsS3Module, UploadModule],
   exports: [UploadModule],
})
export class GlobalModule { }
