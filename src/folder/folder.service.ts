import { Injectable } from '@nestjs/common';
import { FolderPlaceRepository } from 'src/repositories/folder-place.repository';
import { FolderRepository } from 'src/repositories/folder.repository';
import { CreateFolderPlacesReqDto } from './dtos/create-folder-place-req.dto';

@Injectable()
export class FolderService {
  constructor(
    private readonly folderRepository: FolderRepository,
    private readonly folderPlaceRepository: FolderPlaceRepository,
  ) {}

  async getFoldersList(userId?: number) {}

  async getFolderByFolderId(folderId: number) {}

  async getInstaFolder(userId: number) {
    return await this.folderRepository.getInstaFolder(userId);
  }

  async getDefaultFolder(userId: number) {
    return await this.folderRepository.getDefaultFolder(userId);
  }

  async createFolderPlaces(
    userId: number,
    createFolderPlacesReqDto: CreateFolderPlacesReqDto,
  ) {
    const folderId = createFolderPlacesReqDto.folderId
      ? createFolderPlacesReqDto.folderId
      : (await this.getDefaultFolder(userId)).id;

    const placeIds = createFolderPlacesReqDto.placeIds;

    placeIds.forEach(async (placeId) => {
      return await this.folderPlaceRepository.createFolderPlace(
        folderId,
        placeId,
      );
    });
  }

  // deprecated
  // async appendPlaceToInstaFolder(connectedUserId: number, placeId: number) {
  //   const instaFolder = await this.getInstaFolder(connectedUserId);
  //   const createdFolderPlace = await this.createFolderPlace(
  //     instaFolder.id,
  //     placeId,
  //   );
  //   return createdFolderPlace;
  // }
}
