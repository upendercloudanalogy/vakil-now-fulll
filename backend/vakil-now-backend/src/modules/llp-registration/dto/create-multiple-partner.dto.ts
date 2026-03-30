// import { IsArray, ArrayMinSize, ValidateNested } from "class-validator";
// import { Type } from "class-transformer";
// import { CreatePartnerDto } from "./partner.dto";


// export class CreateMultiplePartnersDto {
//   @IsArray()
//   @ArrayMinSize(1)
//   @ValidateNested({ each: true })
//   @Type(() => CreatePartnerDto)
//   partners: CreatePartnerDto[];
// }





import { ApiProperty } from "@nestjs/swagger";
import { IsArray, ArrayMinSize, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreatePartnerDto } from "./partner.dto";

export class CreateMultiplePartnersDto {
  @ApiProperty({
    type: [CreatePartnerDto],
    description: "List of LLP partners",
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreatePartnerDto)
  partners: CreatePartnerDto[];
}
