import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginDto {
@IsEmail({}, { message: 'Invalid email address' })
  @Transform(({ value }) => value?.trim().toLowerCase()) // normalize for DB matching
  email: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @MaxLength(100, { message: 'Password must be at most 100 characters' })
  @Transform(({ value }) => value?.trim())
  password: string;
}
