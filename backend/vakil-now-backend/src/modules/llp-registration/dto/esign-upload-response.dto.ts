import { ApiProperty } from "@nestjs/swagger";

export class EsignUploadResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: "E-sign documents uploaded successfully" })
  message: string;
}
