import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { AnnouncementType } from "./create-announcement.dto";

export class QueryAnnouncementDto {
    @ApiPropertyOptional({
        enum: AnnouncementType,
        description: "Filter by announcement type",
    })
    @IsOptional()
    @IsEnum(AnnouncementType)
    type?: AnnouncementType;
}
