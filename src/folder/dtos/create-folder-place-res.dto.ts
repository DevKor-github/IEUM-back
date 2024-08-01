import { ApiProperty } from '@nestjs/swagger';

export class CreateFolderPlaceResDto {
  @ApiProperty()
  placeIds: number[];

  @ApiProperty()
  folderId?: number;

  @ApiProperty()
  message: string = '장소가 저장되었어요';

  constructor(placeIds: number[], folderId?: number, message?: string) {
    this.placeIds = placeIds;
    this.message = message;
    this.folderId = folderId;
  }
}
