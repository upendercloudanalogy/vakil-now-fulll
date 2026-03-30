import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string,
    @Query('id') id?: string
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (!id) {
      throw new BadRequestException('id is required');
    }

    const targetFolder = folder ?? 'general';

    return this.uploadService.upload(file, targetFolder, id);
  }

}
