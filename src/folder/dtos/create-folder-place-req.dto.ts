import { ApiProperty } from '@nestjs/swagger';

export class CreateFolderPlacesReqDto {
  @ApiProperty()
  placeIds: number[];

  @ApiProperty({ required: false })
  folderId: number; //null로 보낼 시 사용자의 디폴트 폴더에 저장됨
}
