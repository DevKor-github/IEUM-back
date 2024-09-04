import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { FolderType } from 'src/common/enums/folder-type.enum';
import { RawFolderInfo } from 'src/common/interfaces/raw-folder-info.interface';
import {
  createNormalList,
  NormalListMeta,
} from 'src/common/utils/normal-list.util';

export class FolderResDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  type: FolderType;

  @ApiProperty()
  placeCnt: number;

  constructor(rawFolderInfo: RawFolderInfo) {
    this.id = rawFolderInfo.id;
    this.name = rawFolderInfo.name;
    this.type = rawFolderInfo.type;
    this.placeCnt = rawFolderInfo.placeCnt;
  }
}

export class FoldersListResDto {
  @ApiProperty()
  meta: NormalListMeta<RawFolderInfo>;

  @ApiProperty({ type: [FolderResDto] })
  @IsArray()
  items: FolderResDto[];

  constructor(rawFoldersInfoList: RawFolderInfo[]) {
    const { meta, items } = createNormalList(
      rawFoldersInfoList,
      (rawFolderInfo) => new FolderResDto(rawFolderInfo),
    );
    this.meta = meta;
    this.items = items;
  }
}
