import { FolderType } from '../enums/folder-type.enum';

export interface RawFolderInfo {
  id: number;
  name: string;
  type: FolderType;
  placeCnt: number;
}
