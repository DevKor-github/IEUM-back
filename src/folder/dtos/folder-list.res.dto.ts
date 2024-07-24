import { ApiProperty } from '@nestjs/swagger';
import { RawFolderInfo } from 'src/common/interfaces/raw-folder-info.interface';

export class FolderListResDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  placeCnt: number;

  constructor(rawFolderList: RawFolderInfo) {
    this.id = rawFolderList.id;
    this.name = rawFolderList.name;
    this.placeCnt = rawFolderList.placeCnt;
  }
}
