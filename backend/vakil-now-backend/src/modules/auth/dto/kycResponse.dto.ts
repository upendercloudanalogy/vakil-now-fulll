import { ApiProperty } from "@nestjs/swagger";

export class KycResponse {
  @ApiProperty({ example: 'KYC status updated successfully' })
  message: string;
}
