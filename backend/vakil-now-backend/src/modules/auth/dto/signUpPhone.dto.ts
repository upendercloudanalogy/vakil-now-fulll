import { IsString, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpPhoneDto {
  @IsString({ message: 'Phone number must be a string' })
  @Matches(/^[6-9]\d{9}$/, {
    message: 'Invalid Indian mobile number format. Must start with 6-9 and be 10 digits long.'
  })
  @Transform(({ value }) => value?.trim())
  @ApiProperty({ example: '9876543210', description: 'User phone number' })
  phone: string;

   @ApiProperty({
    example: 'USER',
    description: 'Type of user: ADMIN, USER, or LAWYER',
    enum: ['ADMIN', 'USER', 'LAWYER'],
  })
  @IsString({ message: 'Type must be a string' })
  @Matches(/^(ADMIN|USER|LAWYER)$/, {
    message: 'Type must be one of the following values: ADMIN, USER, LAWYER',
  })
  @Transform(({ value }) => value?.trim())
  type: 'ADMIN' | 'USER' | 'LAWYER';
}
