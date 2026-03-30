import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsEmail,
    IsOptional,
    IsString,
    MinLength,
    MaxLength,
    Matches,
    IsBoolean,
    IsEnum,
    IsDateString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export enum KycStatus {
    PENDING = 'PENDING',
    VERIFIED = 'VERIFIED',
    REJECTED = 'REJECTED',
}

export class UpdateUserDto {
    @ApiProperty({
        example: 'John Doe',
        description: 'Full name of the user (only alphabets and spaces allowed)',
    })
    @IsString({ message: 'Name must be a string' })
    @Transform(({ value }) => value?.trim())
    @Matches(/^[a-zA-Z\s]+$/, { message: 'Name can only contain letters and spaces' })
    @MinLength(2, { message: 'Name must be at least 2 characters long' })
    @MaxLength(50, { message: 'Name cannot exceed 50 characters' })
    name: string; // ✅ Required

    @ApiProperty({
        example: 'john.doe@example.com',
        description: 'Valid email address of the user',
    })
    @IsEmail({}, { message: 'Invalid email format' })
    @Transform(({ value }) => value?.toLowerCase().trim())
    @MaxLength(100, { message: 'Email cannot exceed 100 characters' })
    email: string; // ✅ Required

    @ApiProperty({
        example: 'StrongP@ssword123',
        description:
            'New password for the user (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character)',
    })
    @IsString()
    @Transform(({ value }) => value?.trim())
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/, {
        message:
            'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character',
    })
    password?: string; // Optional

    @ApiPropertyOptional({
        example: 'WEB',
        description: 'Signup source (e.g., WEB, APP, REFERRAL)',
    })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.toUpperCase().trim())
    @Matches(/^[A-Z_]+$/, { message: 'Signup source must be uppercase letters or underscores only' })
    @MaxLength(30)
    signupSource?: string;

    @ApiPropertyOptional({
        example: 'REF12345',
        description: 'Referral code (alphanumeric, max 20 characters)',
    })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.toUpperCase().trim())
    @Matches(/^[A-Z0-9]+$/, { message: 'Referral code must be alphanumeric and uppercase' })
    @MaxLength(20)
    referralCode?: string;

    @ApiPropertyOptional({
        example: 'google',
        description: 'UTM source for campaign tracking',
    })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.trim())
    @Matches(/^[a-zA-Z0-9_-]+$/, { message: 'UTM source can only contain letters, numbers, underscores, and hyphens' })
    @MaxLength(50)
    utmSource?: string;

    @ApiPropertyOptional({
        example: 'summer_sale',
        description: 'UTM campaign name (alphanumeric, underscores, and hyphens allowed)',
    })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.trim())
    @Matches(/^[a-zA-Z0-9_-]+$/, { message: 'UTM campaign can only contain letters, numbers, underscores, and hyphens' })
    @MaxLength(50)
    utmCampaign?: string;




}
