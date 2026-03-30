import { ApiProperty } from "@nestjs/swagger";

export class RefreshTokenResponse {
    @ApiProperty({ example: 200 })
    status: number;

    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
    accessToken: string;
}