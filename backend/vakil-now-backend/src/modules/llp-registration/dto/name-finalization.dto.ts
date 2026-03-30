// import { IsNotEmpty, IsString, MaxLength } from "class-validator";
// export class NameFinalizationDto {
//   @IsString()
//   @IsNotEmpty({ message: "Company name is required" })
//   @MaxLength(255, { message: "Company name is too long" })
//   companyName: string;

//   @IsString()
//   @IsNotEmpty({ message: "Object is required" })
//   @MaxLength(1000, { message: "Object is too long" })
//   object: string;
// }




import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class NameFinalizationDto {
  @ApiProperty({
    example: "ABC Consulting LLP",
    description: "Proposed LLP name",
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty({ message: "Company name is required" })
  @MaxLength(255, { message: "Company name is too long" })
  companyName: string;

  @ApiProperty({
    example: "IT consulting and software services",
    description: "Main business object of LLP",
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty({ message: "Object is required" })
  @MaxLength(1000, { message: "Object is too long" })
  object: string;
}
