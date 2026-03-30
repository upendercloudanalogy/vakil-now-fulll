
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { getYMDFormattedDate } from "src/utilis";

@Injectable()
export class S3Service {
  private s3: S3Client;
  private bucketName = process.env.AWS_BUCKET_NAME!;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION || "ap-south-1",
      endpoint: process.env.AWS_ENDPOINT,
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_KEY!,
      },
    });
  }

  /* ===================== UPLOAD ===================== */
  async uploadFile(
    file: Express.Multer.File,
    folder: string,
    id: string
  ): Promise<string> {
    try {
      const key = `${folder}/${getYMDFormattedDate(
        new Date()
      )}-${id}-${file.originalname}`;

      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
      );

      // ✅ RETURN ONLY KEY (NOT URL)
      return key;
    } catch (err) {
      console.error("S3 Upload Error:", err);
      throw new InternalServerErrorException("Error uploading file to S3");
    }
  }

  /* ===================== DELETE ===================== */
  async delete(key: string): Promise<void> {
    try {
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        })
      );
    } catch (err) {
      console.error("S3 Delete Error:", err);
      throw new InternalServerErrorException("Error deleting file from S3");
    }
  }


  /* ===================== SIGNED URL ===================== */
  async getSignedUrl(key: string, expiresIn = 900): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return getSignedUrl(this.s3, command, { expiresIn });
  }
}
