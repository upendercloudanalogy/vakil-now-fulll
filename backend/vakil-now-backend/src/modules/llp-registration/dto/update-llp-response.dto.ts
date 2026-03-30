import { ApiProperty } from "@nestjs/swagger";

export class UpdateLlpResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: "LLP details updated successfully" })
  message: string;
}
