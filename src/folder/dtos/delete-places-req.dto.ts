import { ApiProperty } from '@nestjs/swagger';

export class DeletePlacesReqDto {
  @ApiProperty({ type: [Number] })
  placeIds: number[];
}
