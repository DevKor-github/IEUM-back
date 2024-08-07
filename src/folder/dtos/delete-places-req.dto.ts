import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class DeletePlacesReqDto {
  @ApiProperty({ type: [Number] })
  placeIds: number[];
}
