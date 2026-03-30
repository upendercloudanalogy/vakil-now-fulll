import { Body, Controller, Get, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { SupportComplaintsService } from './support-complaints.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Public } from '../auth/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { FILE } from 'dns';

@Controller('support-complaints')
export class SupportComplaintsController {
    constructor(private supportComplaintsService: SupportComplaintsService) { }


    @Post('raise-ticket')
    @UseInterceptors(FileInterceptor("attachment"))
    async createTicket (@Body() body: CreateTicketDto, @UploadedFile() file: Express.Multer.File) {
        return this.supportComplaintsService.createTicket(body, file);
    }


    @Get('getOpenTickets')
    async getOpenTicket(@Query('page') page = '1', @Query('limit') limit = '10') {
        return this.supportComplaintsService.getOpenTicket(Number(page), Number(limit));
    }


    @Get('getClosedTickets')
    async getClosedTicket(@Query('page') page = '1', @Query('limit') limit = '10') {
        return this.supportComplaintsService.getClosedTicket(Number(page), Number(limit));
    }

    
}

