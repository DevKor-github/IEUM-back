import { Injectable, Logger } from '@nestjs/common';
import { FolderPlaceRepository } from 'src/folder/repositories/folder-place.repository';
import { FolderRepository } from 'src/folder/repositories/folder.repository';
import {
  FolderResDto,
  FoldersListResDto,
  FoldersWithThumbnailListResDto,
} from './dtos/folders-list.res.dto';
import { FolderType } from 'src/common/enums/folder-type.enum';

import { throwIeumException } from 'src/common/utils/exception.util';
import { Folder } from './entities/folder.entity';
import { FolderInfo } from 'src/common/interfaces/raw-folder-info.interface';

@Injectable()
export class FolderService {
  private readonly logger = new Logger(FolderService.name);

  constructor(
    private readonly folderRepository: FolderRepository,
    private readonly folderPlaceRepository: FolderPlaceRepository,
  ) {}

  // ------폴더 관련 메서드------
  async getRawFoldersList(userId: number) {
    return await this.folderRepository.getFoldersList(userId);
  }
  async getFoldersList(userId: number): Promise<FoldersListResDto> {
    const rawFoldersList = await this.folderRepository.getFoldersList(userId);
    const foldersList = new FoldersListResDto(rawFoldersList);
    return foldersList;
  }

  async getFoldersWithThumbnailList(
    userId: number,
  ): Promise<FoldersWithThumbnailListResDto> {
    const rawFoldersList = await this.folderRepository.getFoldersList(userId);
    const folderThumbnails = [];
    for (const folder of rawFoldersList) {
      const folderThumbnail = await this.getFolderThumbnail(folder.id);
      folderThumbnails.push(folderThumbnail);
    }
    const foldersList = new FoldersWithThumbnailListResDto(
      rawFoldersList,
      folderThumbnails,
    );
    return foldersList;
  }

  async getFolderThumbnail(folderId: number): Promise<string> {
    return await this.folderPlaceRepository.getFolderThumbnail(folderId);
  }

  async getFolderByFolderId(folderId: number): Promise<FolderResDto> {
    const folder = await this.getRawFolderByFolderId(folderId);
    return new FolderResDto(folder);
  }

  async getRawFolderByFolderId(folderId: number): Promise<FolderInfo> {
    return await this.folderRepository.getFolderByFolderId(folderId);
  }

  async getRawFolderByIdWithCheckingStatus(userId: number, folderId: number) {
    const folder = await this.folderRepository.getFolderByFolderId(folderId);
    if (!folder) {
      throwIeumException('FOLDER_NOT_FOUND');
    }
    if (folder.userId !== userId) {
      throwIeumException('FORBIDDEN_FOLDER');
    }

    return folder;
  }

  async getDefaultFolder(userId: number): Promise<FolderResDto> {
    const defaultFolder = await this.folderRepository.getDefaultFolder(userId);
    const folderWithFolderPlaces =
      await this.folderRepository.getFolderByFolderId(defaultFolder.id);
    return new FolderResDto(folderWithFolderPlaces);
  }

  async createNewFolder(userId: number, folderName: string): Promise<Folder> {
    const folder = await this.folderRepository.createFolder(userId, folderName);
    return folder;
  }

  async changeFolderName(userId: number, folderId: number, folderName: string) {
    const targetFolder =
      await this.folderRepository.getFolderByFolderId(folderId);
    if (!targetFolder) {
      throwIeumException('FOLDER_NOT_FOUND');
    }
    if (targetFolder.userId !== userId) {
      throwIeumException('FORBIDDEN_FOLDER');
    }
    return await this.folderRepository.changeFolderName(
      userId,
      targetFolder.id,
      folderName,
    );
  }

  async deleteFolder(userId: number, folderId: number) {
    const targetFolder =
      await this.folderRepository.getFolderByFolderId(folderId);
    if (!targetFolder) {
      throwIeumException('FOLDER_NOT_FOUND');
    }
    if (
      targetFolder.userId != userId ||
      targetFolder.type == FolderType.Default
    ) {
      throwIeumException('FORBIDDEN_FOLDER');
    }

    return await this.folderRepository.deleteFolder(folderId);
  }

  // ------폴더-장소 관련 메서드------

  async getRawMarkers(
    userId: number,
    addressList: string[],
    kakaoCategoriesForFiltering: string[],
    folderId?: number,
  ) {
    return await this.folderPlaceRepository.getMarkers(
      userId,
      addressList,
      kakaoCategoriesForFiltering,
      folderId,
    );
  }

  async getRawPlacesList(
    userId: number,
    take: number,
    addressList: string[],
    kakaoCategoriesForFiltering: string[],
    cursorId?: number,
    folderId?: number,
  ) {
    return await this.folderPlaceRepository.getPlacesList(
      userId,
      take,
      addressList,
      kakaoCategoriesForFiltering,
      cursorId,
      folderId,
    );
  }

  async createFolderPlace(folderId: number, placeId: number) {
    return await this.folderPlaceRepository.createFolderPlace(
      folderId,
      placeId,
    );
  }

  async deleteFolderPlaces(folderId: number, placeIds: number[]) {
    return await this.folderPlaceRepository.deleteFolderPlaces(
      folderId,
      placeIds,
    );
  }
}
