import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { FolderType } from 'src/common/enums/folder-type.enum';
import { FolderInfo } from 'src/common/interfaces/raw-folder-info.interface';
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

  constructor(folderInfo: FolderInfo) {
    this.id = folderInfo.id;
    this.name = folderInfo.name;
    this.type = folderInfo.type;
    this.placeCnt = folderInfo.placeCnt;
  }
}

export class FoldersListResDto {
  @ApiProperty()
  meta: NormalListMeta<FolderInfo>;

  @ApiProperty({ type: [FolderResDto] })
  @IsArray()
  items: FolderResDto[];

  constructor(foldersInfoList: FolderInfo[]) {
    const { meta, items } = createNormalList(
      foldersInfoList,
      (folderInfo) => new FolderResDto(folderInfo),
    );
    this.meta = meta;
    this.items = items;
  }
}
