import { ApiProperty } from '@nestjs/swagger';

export class CreateFolderPlacesReqDto {
  @ApiProperty()
  collectionId: number;

  @ApiProperty({ type: [Number] })
  placeIds: number[];
}
