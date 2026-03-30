import { Controller, Get, Logger, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ServiceService } from './service.service';

@Controller('service')
export class ServiceController {
    constructor (private serviceService: ServiceService
    ) {

    }


    @Post('text-extract')
    @UseInterceptors(FileInterceptor('file'))
    async extract (@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            return { success: false, message: "No file provided" };
        }
        const text = await this.serviceService.extractText(file.buffer);
        return { success: true, text };
    }


    @Get('places/autosuggest')
    async autoSuggestPlaces (@Query('query') query: string) {
        return await this.serviceService.autoSuggestPlaces(query);
    }

}
