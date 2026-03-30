import { ApiProperty } from "@nestjs/swagger";

export class AnnouncementResponseDto {
    @ApiProperty({ example: "uuid" })
    id: string;

    @ApiProperty({ enum: ["offer", "activity"] })
    type: string;

    @ApiProperty({ enum: ["active", "expired"] })
    status: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;

    @ApiProperty({ example: "2026-01-16T10:00:00Z" })
    createdAt: string;

    @ApiProperty({ example: true })
    isRead: boolean;
}
