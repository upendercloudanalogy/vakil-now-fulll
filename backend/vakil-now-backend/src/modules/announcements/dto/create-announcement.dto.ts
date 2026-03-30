import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
    IsDateString,
    IsEnum,
    IsOptional,
    IsString,
    MinLength,
} from "class-validator";

export enum AnnouncementType {
    OFFER = "offer",
    ACTIVITY = "activity",
}

export enum AnnouncementStatus {
    ACTIVE = "active",
    EXPIRED = "expired",
}

export class CreateAnnouncementDto {
    @ApiProperty({ enum: AnnouncementType, example: AnnouncementType.OFFER })
    @IsEnum(AnnouncementType)
    type: AnnouncementType;

    @ApiProperty({ minLength: 5, example: "Special Discount" })
    @IsString()
    @MinLength(5)
    title: string;

    @ApiProperty({ minLength: 10, example: "Get 50% off on all services" })
    @IsString()
    @MinLength(10)
    description: string;

    @ApiPropertyOptional({ enum: AnnouncementStatus, example: AnnouncementStatus.ACTIVE })
    @IsOptional()
    @IsEnum(AnnouncementStatus)
    status?: AnnouncementStatus;

    @ApiPropertyOptional({ example: "2023-12-01T00:00:00Z" })
    @IsOptional()
    @IsDateString()
    @Type(() => Date)
    startDate?: Date;

    @ApiPropertyOptional({ example: "2023-12-31T23:59:59Z" })
    @IsOptional()
    @IsDateString()
    @Type(() => Date)
    endDate?: Date;
}
