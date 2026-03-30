import { ApiProperty } from "@nestjs/swagger";

export class EmailLinkResponse {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ example: 'Verification email sent successfully' })
    message: string;

    @ApiProperty({ example: 'user@example.com' })
    email: string;
}