import { ApiProperty } from '@nestjs/swagger';
import { RawFolderList } from 'src/common/interfaces/raw-folder-list.interface';

export class FolderListResDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  placeCnt: number;

  constructor(rawFolderList: RawFolderList) {
    this.id = rawFolderList.id;
    this.name = rawFolderList.name;
    this.placeCnt = rawFolderList.placeCnt;
  }
}
