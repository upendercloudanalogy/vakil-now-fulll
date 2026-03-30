import { IsString, Matches, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class VerifyOtpDto {
  
    @IsString({ message: 'Phone number must be a string' })
    @Matches(/^[6-9]\d{9}$/, { 
      message: 'Invalid Indian mobile number format. Must start with 6-9 and be 10 digits long.' 
    })
    @Transform(({ value }) => value?.trim())
    phone: string;

    @MaxLength(6, { message: 'OTP must be 6 digits' })
    @MinLength(6, { message: 'OTP must be 6 digits' })
    @IsString({ message: 'OTP must be a string' })
    @Matches(/^\d{6}$/, { message: 'Invalid OTP format. Must be a 6-digit number.' })
    @Transform(({ value }) => value?.trim())
    otp: string;
}