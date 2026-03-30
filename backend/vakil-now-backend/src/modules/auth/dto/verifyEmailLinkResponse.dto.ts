import { ApiProperty } from "@nestjs/swagger";

export class VerifyEmailLinkResponse {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ example: 'Email verified successfully' })
    message: string;

    @ApiProperty({
        example: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            email: 'user@example.com',
            emailVerified: true
        }
    })
    user: any;
}