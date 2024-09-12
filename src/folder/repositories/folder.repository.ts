import { Injectable } from '@nestjs/common';
import { FolderType } from 'src/common/enums/folder-type.enum';
import { RawFolderInfo } from 'src/common/interfaces/raw-folder-info.interface';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { Folder } from '../entities/folder.entity';

@Injectable()
export class FolderRepository extends Repository<Folder> {
  constructor(private readonly dataSource: DataSource) {
    super(Folder, dataSource.createEntityManager());
  }

  async getFoldersList(userId: number): Promise<RawFolderInfo[]> {
    const foldersList = await this.find({
      where: { userId: userId },
      relations: ['folderPlaces'],
    });

    const foldersListWithPlaceCnt = foldersList.map((folder) => ({
      id: folder.id,
      name: folder.name,
      type: folder.type,
      placeCnt: folder.folderPlaces.length,
    }));
    return foldersListWithPlaceCnt;
  }

  async getFolderByFolderId(folderId: number) {
    return await this.findOne({ where: { id: folderId } });
  }

  async getDefaultFolder(userId: number) {
    let defaultFolder = await this.findOne({
      where: { userId: userId, type: FolderType.Default },
    });

    if (!defaultFolder) {
      defaultFolder = await this.createFolder(
        userId,
        '저장한 장소',
        FolderType.Default,
      );
    }
    return defaultFolder;
  }

  async createFolder(
    userId: number,
    folderName: string,
    folderType?: FolderType,
  ) {
    if (folderType === FolderType.Default) {
      const folder = await this.findOne({
        where: { userId: userId, type: folderType, name: folderName },
      });
      if (folder) {
        return folder;
      }
    }
    const newFolder = new Folder();
    newFolder.userId = userId;
    newFolder.name = folderName;
    if (folderType !== undefined) {
      newFolder.type = folderType;
    }
    const saveNewFolder = await this.save(newFolder);
    return saveNewFolder;
  }

  async changeFolderName(userId: number, folderId: number, folderName: string) {
    await this.update({ id: folderId, userId: userId }, { name: folderName });
  }

  async deleteFolder(folderId: number) {
    await this.delete({ id: folderId }); //folder-place cascading 되어있는지 체크
  }
}
