import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
    constructor (private adminService: AdminService    ) { }

    @Get('dashboard-card-details')
    async getDetailsOfCards () {
        return this.adminService.getDetailsOfDashboardCards();
    }

    @Get('growth-graph-data')
    async getGrowthGrapthData () {
        return this.adminService.getGrowthGrapthData();
    }

    @Get('support-tickets-counts')
    async getSupportTicketsCounts () {
        return this.adminService.getSupportTicketsCounts();
    }

    @Post('create-announcement')
    async createAnnouncement (@Body() body: any) {
        return this.adminService.createAnnouncement(body);
    }


    @Get('lawyer-requests')
    async getLawyerRequests(){
        // return this.adminService.getLawyerRequests();
    }
}