import { ApiProperty } from "@nestjs/swagger";

export class SignUpResponse {
    @ApiProperty({ example: 200 })
    status: number;

    @ApiProperty({ example: 'OTP sent successfully' })
    message: string;

    @ApiProperty({ example: '9876543210' })
    phone: string;
}