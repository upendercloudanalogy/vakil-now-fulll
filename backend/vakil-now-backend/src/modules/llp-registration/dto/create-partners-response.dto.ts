import { ApiProperty } from "@nestjs/swagger";

export class CreatePartnersResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: "Partners created successfully" })
  message: string;

  @ApiProperty({
    example: 2,
    description: "Number of partners created",
  })
  totalPartners: number;
}
