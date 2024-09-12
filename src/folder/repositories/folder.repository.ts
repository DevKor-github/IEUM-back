import { Injectable } from '@nestjs/common';
import { FolderType } from 'src/common/enums/folder-type.enum';
import { FolderInfo } from 'src/common/interfaces/raw-folder-info.interface';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { Folder } from '../entities/folder.entity';

@Injectable()
export class FolderRepository extends Repository<Folder> {
  constructor(private readonly dataSource: DataSource) {
    super(Folder, dataSource.createEntityManager());
  }

  async getFoldersList(userId: number): Promise<FolderInfo[]> {
    const foldersList = await this.createQueryBuilder('folder')
      .leftJoinAndSelect('folder.folderPlaces', 'folderPlaces')
      .select([
        'folder.id AS id',
        'folder.userId AS user_id',
        'folder.name AS name',
        'folder.type AS type',
        'COUNT(folderPlaces.id) AS places_cnt',
      ])
      .where('folder.userId = :userId', { userId })
      .groupBy('folder.id')
      .getRawMany();
    const foldersListWithPlaceCnt = foldersList.map((folder) => ({
      id: folder.id,
      userId: folder.user_id,
      name: folder.name,
      type: parseInt(folder.type),
      placeCnt: parseInt(folder.places_cnt),
    }));

    return foldersListWithPlaceCnt;
  }

  async getFolderByFolderId(folderId: number): Promise<FolderInfo> {
    const folder = await this.createQueryBuilder('folder')
      .leftJoinAndSelect('folder.folderPlaces', 'folderPlaces')
      .select([
        'folder.id AS id',
        'folder.userId AS user_id',
        'folder.name AS name',
        'folder.type AS type',
        'COUNT(folderPlaces.id) AS places_cnt',
      ])
      .where('folder.id = :folderId', { folderId })
      .groupBy('folder.id')
      .getRawOne();

    const folderWithPlaceCnt = {
      id: folder.id,
      userId: folder.userId,
      name: folder.name,
      type: parseInt(folder.type),
      placeCnt: parseInt(folder.places_cnt),
    };

    console.log(folderWithPlaceCnt);
    return folderWithPlaceCnt;
  }

  async getDefaultFolder(userId: number): Promise<Folder> {
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
