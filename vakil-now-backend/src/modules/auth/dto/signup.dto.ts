
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsInt, IsNotEmpty, IsOptional, IsPhoneNumber,IsEmail, IsString, Matches, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class SignupDto {

  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(50, { message: 'Name must be at most 50 characters' })
  @Matches(/^[a-zA-Z\s]+$/, { message: 'Name can only contain letters and spaces' })
  @Transform(({ value }) => value?.trim())
  name: string;


  @IsEmail({}, { message: 'Invalid email address' })
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, { message: 'Invalid email format' }) // stricter regex
  @Transform(({ value }) => value?.trim().toLowerCase())
  email: string;


  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(100, { message: 'Password must be at most 100 characters' })
  @Matches(
    /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/,
    { message: 'Password must contain uppercase, lowercase, number and special character' }
  )
  @Transform(({ value }) => value?.trim())
  password: string;


  @IsOptional()
  @IsString()
  platform?: string; // WEB | APP | REFERRAL

  @IsOptional()
  @IsString()
  signup_source?: string;

  @IsOptional()
  @IsString()
  referral_code?: string;

  @IsOptional()
  @IsString()
  utm_source?: string;

  @IsOptional()
  @IsString()
  utm_campaign?: string;


  @IsOptional()
  @IsBoolean()
  email_verified?: boolean;

  @IsOptional()
  @IsString()
  verification_token?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  verification_expires_at?: Date;


  @IsOptional()
  @IsString()
  kyc_status?: string; // e.g., 'PENDING', 'VERIFIED'

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;


  @IsOptional()
  @IsInt()
  role_id?: number;

  @IsOptional()
  @IsString()
  captcha_token?: string;

  @IsOptional()
  @IsString()
  fingerprint?: string;

  @IsOptional()
  @IsArray()
  consents?: {
    type: string;
    value: boolean;
    version?: string;
  }[];

}

