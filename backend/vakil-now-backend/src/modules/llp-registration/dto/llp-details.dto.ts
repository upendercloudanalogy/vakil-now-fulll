// import {
//   IsEmail,
//   IsMobilePhone,
//   IsNotEmpty,
//   IsOptional,
//   IsString,
//   IsNumber,
//   Min,
// } from "class-validator";
// import { Type } from "class-transformer";

// export class UpdateLlpInfoDto {
//   @IsEmail({}, { message: "Invalid LLP email" })
//   email: string;

//   @IsMobilePhone("en-IN", {}, { message: "Invalid mobile number 1" })
//   mobileNumber1: string;

//   @IsMobilePhone("en-IN", {}, { message: "Invalid mobile number 2" })
//   @IsOptional()
//   mobileNumber2?: string;

//   @IsString()
//   @IsNotEmpty({ message: "Registered office address is required" })
//   address: string;

//   @Type(() => Number)
//   @IsNumber()
//   @Min(0)
//   durationOfStay: number;
// }




import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

export class UpdateLlpInfoDto {
  @ApiProperty({ example: "llp@example.com" })
  @IsEmail({}, { message: "Invalid LLP email" })
  email: string;

  @ApiProperty({ example: "9876543210" })
  @IsMobilePhone("en-IN", {}, { message: "Invalid mobile number 1" })
  mobileNumber1: string;

  @ApiPropertyOptional({ example: "9123456789" })
  @IsMobilePhone("en-IN", {}, { message: "Invalid mobile number 2" })
  @IsOptional()
  mobileNumber2?: string;

  @ApiProperty({
    example: "123, Connaught Place, New Delhi",
  })
  @IsString()
  @IsNotEmpty({ message: "Registered office address is required" })
  address: string;

  @ApiProperty({
    example: 3,
    description: "Duration of stay at registered address (in years)",
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  durationOfStay: number;
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  removeResidentialProof?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  removeNoc?: boolean;

}
