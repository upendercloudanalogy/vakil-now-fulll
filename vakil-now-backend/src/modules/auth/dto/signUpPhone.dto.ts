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
}