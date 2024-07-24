import { Injectable } from '@nestjs/common';
import { FolderType } from 'src/common/enums/folder-type.enum';
import { RawFolderInfo } from 'src/common/interfaces/raw-folder-info.interface';
import { Folder } from 'src/entities/folder.entity';
import { Repository, DataSource, EntityManager } from 'typeorm';

@Injectable()
export class FolderRepository extends Repository<Folder> {
  private readonly folderRepository: Repository<Folder>;

  constructor(private readonly dataSource: DataSource) {
    super(Folder, dataSource.createEntityManager());
  }

  async findFolderByFolderId(folderId: number) {
    return await this.findOne({ where: { id: folderId } });
  }
  async createFolder(
    userId: number,
    folderName: string,
    folderType?: FolderType,
  ) {
    if (folderType === (FolderType.Insta | FolderType.Default)) {
      //default, insta 폴더는 최대 1개 존재
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
    if (folderType) {
      newFolder.type = folderType;
    }
    const saveNewFolder = await this.save(newFolder);
    return saveNewFolder;
  }
  async getDefaultFolder(userId: number) {
    let defaultFolder = await this.folderRepository.findOne({
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

  async getInstaFolder(userId: number) {
    let instaFolder = await this.findOne({
      where: { userId: userId, type: FolderType.Insta },
    });
    if (!instaFolder) {
      instaFolder = await this.createFolder(
        userId,
        '인스타그램에서 저장한 장소',
        FolderType.Insta,
      );
    }
    return instaFolder;
  }

  async getFolderList(userId: number): Promise<RawFolderInfo[]> {
    const folderList = await this.find({
      where: { userId: userId },
      relations: ['folderPlaces'],
    });

    const folderListWithPlaceCnt = folderList.map((folder) => ({
      id: folder.id,
      name: folder.name,
      placeCnt: folder.folderPlaces.length,
    }));
    return folderListWithPlaceCnt;
  }

  async deleteFolder(folderId: number) {
    await this.delete({ id: folderId });
  }

  async changeFolderName(userId: number, folderId: number, folderName: string) {
    await this.update({ id: folderId, userId: userId }, { name: folderName });
  }
}
