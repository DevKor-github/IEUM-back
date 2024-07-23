import { ApiProperty } from '@nestjs/swagger';

export class CreateFolderPlaceReqDto {
  @ApiProperty()
  placeId: number;

  @ApiProperty()
  folderId: number;
}
