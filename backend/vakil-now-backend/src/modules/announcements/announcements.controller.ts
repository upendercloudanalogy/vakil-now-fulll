import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Req,
} from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger";

import { Public } from "../auth/decorators/public.decorator";
import { AnnouncementsService } from "./announcements.service";
import { AnnouncementResponseDto } from "./dto/announcement-response.dto";
import { AnnouncementType, CreateAnnouncementDto } from "./dto/create-announcement.dto";
import { QueryAnnouncementDto } from "./dto/query-announcement.dto";

@ApiTags("Announcements")
@Controller("announcements")
export class AnnouncementsController {
    constructor(private readonly service: AnnouncementsService) { }

    // ---------------- CREATE ANNOUNCEMENT ----------------
    @Post()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Create announcement (Admin)" })
    @ApiBody({ type: CreateAnnouncementDto })
    @ApiResponse({
        status: 201,
        description: "Announcement created successfully",
    })
    @ApiResponse({
        status: 400,
        description: "Invalid request data",
    })
    create(@Body() body: CreateAnnouncementDto) {
        return this.service.create(body);
    }

    // ---------------- GET ANNOUNCEMENTS ----------------
    @Get()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Get announcements for logged-in user" })
    @ApiQuery({
        name: "type",
        required: false,
        enum: AnnouncementType,
    })
    @ApiResponse({
        status: 200,
        description: "List of announcements",
        type: AnnouncementResponseDto,
        isArray: true,
    })
    findAll(@Query() query: QueryAnnouncementDto, @Req() req: any) {
        const userId = req.userId
        return this.service.findAll(userId, query.type);
    }

    // ---------------- MARK ALL READ ----------------
    @Patch("mark-all-read")
    @ApiBearerAuth()
    @ApiOperation({ summary: "Mark all announcements as read for logged-in user" })
    @ApiResponse({
        status: 200,
        description: "All announcements marked as read",
        schema: {
            example: { success: true, count: 5 },
        },
    })
    markAllRead(@Query("type") type: AnnouncementType, @Req() req: any) {
        const userId = req.userId;
        return this.service.markAllAsRead(userId, type);
    }
}
