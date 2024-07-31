import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { RawFolderInfo } from 'src/common/interfaces/raw-folder-info.interface';

export class FolderResDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  placeCnt: number;

  constructor(rawFolderInfo: RawFolderInfo) {
    this.id = rawFolderInfo.id;
    this.name = rawFolderInfo.name;
    this.placeCnt = rawFolderInfo.placeCnt;
  }
}

export class FoldersListResDto {
  @ApiProperty({ type: [FolderResDto] })
  @IsArray()
  foldersList: FolderResDto[];

  constructor(rawFoldersInfoList: RawFolderInfo[]) {
    this.foldersList = rawFoldersInfoList.map(
      (rawFolderInfo) => new FolderResDto(rawFolderInfo),
    );
  }
}
