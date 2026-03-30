import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserResponse {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ example: 'User updated successfully' })
    message: string;

    @ApiProperty({
        example: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'John Doe',
            email: 'john@example.com',
            kycStatus: 'PENDING'
        }
    })
    user: any;
}