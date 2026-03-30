
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsBoolean,
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
  ValidateIf,
} from "class-validator";

export class CreatePartnerDto {

  @ApiPropertyOptional({ description: "Partner ID (UUID)", example: "550e8400-e29b-41d4-a716-446655440000" })
  @IsString()
  @IsOptional()
  id?: string; // Must be string to match DB schema

  @ApiProperty({ example: "John Doe" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "9876543210" })
  @IsMobilePhone("en-IN")
  mobileNumber: string;

  @ApiProperty({ example: "john@example.com" })
  @IsEmail()
  emailId: string;

  @ApiProperty({ example: "Businessman" })
  @IsString()
  @IsNotEmpty()
  occupation: string;

  @ApiPropertyOptional({ example: "MBA" })
  @IsString()
  @IsOptional()
  education?: string;

  @ApiProperty({ example: 500000 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  contributedCapital: number;

  @ApiPropertyOptional({ example: "Delhi" })
  @IsString()
  @IsOptional()
  placeOfBirth?: string;

  @ApiPropertyOptional({ example: 50 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  partnerRatio?: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  dscAvailable?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  dinAvailable?: boolean;

  // populated by backend
  profilePicUrl?: string;
  idProofUrl?: string;
  residentialProofUrl?: string;
  panCardUrl?: string;

  removePicture?: boolean | string;
  removeIdentityProof?: boolean | string;
  removeResidentialProof?: boolean | string;
  removePanCard?: boolean | string;
  @ValidateIf(o => o.dinAvailable === true)
  @Matches(/^[0-9]{8}$/, { message: 'DIN must be exactly 8 digits' })
  dinNumber?: string;
  deleted?: boolean;



}
