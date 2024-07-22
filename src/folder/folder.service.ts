import { Injectable } from '@nestjs/common';
import { FolderPlaceRepository } from 'src/repositories/folder-place.repository';
import { FolderRepository } from 'src/repositories/folder.repository';
import { FolderListResDto } from './dtos/folder-list.res.dto';

@Injectable()
export class FolderService {
  constructor(
    private readonly folderRepository: FolderRepository,
    private readonly folderPlaceRepository: FolderPlaceRepository,
  ) {}

  async getFolderList(userId: number): Promise<FolderListResDto[]> {
    const rawFolderList = await this.folderRepository.getFolderList(userId);
    const folderList = rawFolderList.map(
      (folder) => new FolderListResDto(folder),
    );
    return folderList;
  }

  async getFolderByFolderId(folderId: number) {}

  async getInstaFolder(userId: number) {
    return await this.folderRepository.getInstaFolder(userId);
  }

  async getDefaultFolder(userId: number) {
    return await this.folderRepository.getDefaultFolder(userId);
  }

  async createFolderPlace(folderId: number, placeId: number) {
    return await this.folderPlaceRepository.createFolderPlace(
      folderId,
      placeId,
    );
  }

  async appendPlaceToInstaFolder(connectedUserId: number, placeId: number) {
    const instaFolder = await this.getInstaFolder(connectedUserId);
    const createdFolderPlace = await this.createFolderPlace(
      instaFolder.id,
      placeId,
    );
    return createdFolderPlace;
  }
}
