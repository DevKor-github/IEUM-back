import { ApiProperty } from '@nestjs/swagger';

export class CreatePlaceTagReqDto {
  @ApiProperty()
  placeId: number;

  @ApiProperty()
  tagId: number;
}
