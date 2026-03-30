import { IsEmail, IsString, Matches, MinLength, MaxLength } from 'class-validator';
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

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(100, { message: 'Password must be at most 100 characters' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    { message: 'Password must contain uppercase, lowercase, number and special character' }
  )
  @Transform(({ value }) => value?.trim())
  password: string;
}
