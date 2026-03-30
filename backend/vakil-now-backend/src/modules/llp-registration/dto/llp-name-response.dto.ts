import { ApiProperty } from "@nestjs/swagger";

export class LlpNameResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: "Name finalized successfully" })
  message: string;

  @ApiProperty({ example: "uuid-llp-id" })
  llpId: string;
}
