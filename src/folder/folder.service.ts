import { Injectable } from '@nestjs/common';
import { FolderPlaceRepository } from 'src/repositories/folder-place.repository';
import { FolderRepository } from 'src/repositories/folder.repository';
import { CreateFolderPlacesReqDto } from './dtos/create-folder-place-req.dto';
import {
  ForbiddenFolderException,
  NotValidFolderException,
} from 'src/common/exceptions/folder.exception';
import { Transactional } from 'typeorm-transactional';
import { CreateFolderPlaceResDto } from './dtos/create-folder-place-res.dto';

@Injectable()
export class FolderService {
  constructor(
    private readonly folderRepository: FolderRepository,
    private readonly folderPlaceRepository: FolderPlaceRepository,
  ) {}

  async getFoldersList(userId?: number) {}

  async getFolderByFolderId(folderId: number) {
    return await this.folderRepository.getFolderByFolderId(folderId);
  }

  async getInstaFolder(userId: number) {
    return await this.folderRepository.getInstaFolder(userId);
  }

  async getDefaultFolder(userId: number) {
    return await this.folderRepository.getDefaultFolder(userId);
  }

  async createFolderPlacesIntoFolder(
    //기본 Folder-place 저장 로직
    userId: number,
    createFolderPlacesReqDto: CreateFolderPlacesReqDto,
    folderId: number,
  ) {
    const placeIds = createFolderPlacesReqDto.placeIds;

    const folder = await this.getFolderByFolderId(folderId);
    if (!folder) {
      throw new NotValidFolderException('폴더가 존재하지 않아요.');
    }
    if (folder.userId !== userId) {
      throw new ForbiddenFolderException('폴더에 대한 권한이 없어요.');
    }

    placeIds.forEach(async (placeId) => {
      await this.folderPlaceRepository.createFolderPlace(folderId, placeId);
    });
  }

  @Transactional()
  async createFolderPlacesIntoDefaultFolder(
    // Default 폴더에만 저장할 때 호출되는 메서드
    userId: number,
    createFolderPlacesReqDto: CreateFolderPlacesReqDto,
  ): Promise<CreateFolderPlaceResDto> {
    const defaultFolder = await this.getDefaultFolder(userId);
    await this.createFolderPlacesIntoFolder(
      userId,
      createFolderPlacesReqDto,
      defaultFolder.id,
    );

    return new CreateFolderPlaceResDto(createFolderPlacesReqDto.placeIds);
  }

  @Transactional()
  async createFolderPlacesIntoSpecificFolder(
    // 특정 폴더에 저장할 때 호출되는 메서드. default 폴더에도 저장하고, 특정 폴더에도 저장
    userId: number,
    createFolderPlacesReqDto: CreateFolderPlacesReqDto,
    folderId: number,
  ): Promise<CreateFolderPlaceResDto> {
    await this.createFolderPlacesIntoDefaultFolder(
      userId,
      createFolderPlacesReqDto,
    );
    await this.createFolderPlacesIntoFolder(
      userId,
      createFolderPlacesReqDto,
      folderId,
    );

    return new CreateFolderPlaceResDto(
      createFolderPlacesReqDto.placeIds,
      folderId,
    );
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
