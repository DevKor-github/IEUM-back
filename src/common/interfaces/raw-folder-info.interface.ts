import { FolderType } from '../enums/folder-type.enum';

export interface FolderInfo {
  id: number;
  userId: number;
  name: string;
  type: FolderType;
  placeCnt: number;
}
