import { ApiProperty } from '@nestjs/swagger';

export class CreateFolderPlacesReqDto {
  @ApiProperty()
  placeIds: number[];
}
