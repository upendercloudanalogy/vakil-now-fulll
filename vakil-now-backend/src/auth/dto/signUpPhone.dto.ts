import { IsString, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class SignUpPhoneDto {
  @IsString({ message: 'Phone number must be a string' })
  @Matches(/^[6-9]\d{9}$/, { 
    message: 'Invalid Indian mobile number format. Must start with 6-9 and be 10 digits long.' 
  })
  @Transform(({ value }) => value?.trim())
  phone: string;
}