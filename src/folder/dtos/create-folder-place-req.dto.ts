import { ApiProperty } from '@nestjs/swagger';

export class CreateFolderPlacesReqDto {
  @ApiProperty({ type: [Number] })
  placeIds: number[];
}
