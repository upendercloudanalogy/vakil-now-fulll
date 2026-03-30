import { IsString, Matches, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({
    example: '9876543210',
    description: 'User phone number (Indian format)',
  })
  @IsString({ message: 'Phone number must be a string' })
  @Matches(/^[6-9]\d{9}$/, {
    message:
      'Invalid Indian mobile number format. Must start with 6-9 and be 10 digits long.',
  })
  @Transform(({ value }) => String(value).trim())
  phone: string;

  @ApiProperty({
    example: '123456',
    description: '6-digit OTP sent to the phone number',
  })
  @IsString({ message: 'OTP must be a string' })
  @MinLength(6, { message: 'OTP must be 6 digits' })
  @MaxLength(6, { message: 'OTP must be 6 digits' })
  @Matches(/^\d{6}$/, { message: 'Invalid OTP format. Must be a 6-digit number.' })
  @Transform(({ value }) => value?.trim())
  otp: string;

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
