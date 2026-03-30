import { ApiProperty } from "@nestjs/swagger";

export class VerifyOtpResponse {
    @ApiProperty({ example: 'User registered successfully' })
    message: string;

    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
    accessToken: string;

    @ApiProperty({
        example: {
            name: 'John Doe',
            phone: '9876543210'
        }
    })
    user: any;
}