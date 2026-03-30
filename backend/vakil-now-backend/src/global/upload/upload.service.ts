
import { Injectable } from "@nestjs/common";
import { S3Service } from "../aws-s3/aws-s3.service";

@Injectable()
export class UploadService {
  constructor(private readonly s3Service: S3Service) {}

  async upload(
    file: Express.Multer.File,
    folder = "general",
    id: string
  ): Promise<string> {
    // returns S3 KEY
    return this.s3Service.uploadFile(file, folder, id);
  }

  async getPreviewUrl(key: string): Promise<string> {
    return this.s3Service.getSignedUrl(key);
  }
}
