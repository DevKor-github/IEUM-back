import { Injectable } from '@nestjs/common';
import { FolderPlaceRepository } from 'src/repositories/folder-place.repository';
import { FolderRepository } from 'src/repositories/folder.repository';
import { FolderResDto, FoldersListResDto } from './dtos/folders-list.res.dto';
import { CreateFolderReqDto } from './dtos/create-folder-req.dto';
import { FolderType } from 'src/common/enums/folder-type.enum';
import {
  MarkerResDto,
  MarkersListResDto,
} from 'src/place/dtos/markers-list-res.dto';
import { PlacesListReqDto } from 'src/place/dtos/places-list-req.dto';
import { CreateFolderPlacesReqDto } from './dtos/create-folder-place-req.dto';
import {
  ForbiddenFolderException,
  NotValidFolderException,
} from 'src/common/exceptions/folder.exception';
import { Transactional } from 'typeorm-transactional';
import { CreateFolderPlaceResDto } from './dtos/create-folder-place-res.dto';
import { PlacesListResDto } from 'src/place/dtos/paginated-places-list-res.dto';

@Injectable()
export class FolderService {
  constructor(
    private readonly folderRepository: FolderRepository,
    private readonly folderPlaceRepository: FolderPlaceRepository,
  ) {}

  async getFoldersList(userId: number): Promise<FoldersListResDto> {
    const rawFoldersList = await this.folderRepository.getFoldersList(userId);
    const foldersList = new FoldersListResDto(rawFoldersList);
    return foldersList;
  }

  async createNewFolder(
    userId: number,
    createFolderReqDto: CreateFolderReqDto,
  ) {
    return await this.folderRepository.createFolder(
      userId,
      createFolderReqDto.name,
    );
  }

  async deleteFolder(userId: number, folderId: number) {
    const targetFolder =
      await this.folderRepository.findFolderByFolderId(folderId);
    if (targetFolder.userId != userId) {
      throw new ForbiddenFolderException(
        '해당 폴더의 소유주가 아니라 권한이 없음.',
      );
    }
    if (targetFolder.type == FolderType.Default) {
      throw new ForbiddenFolderException(
        'Default 폴더에 대한 권한이 없어 삭제할 수 없음.',
      );
    }

    return await this.folderRepository.deleteFolder(folderId);
  }

  async changeFolderName(userId: number, folderId: number, folderName: string) {
    return await this.folderRepository.changeFolderName(
      userId,
      folderId,
      folderName,
    );
  }

  async deleteFolderPlaces(
    userId: number,
    folderId: number,
    placeIds: number[],
  ) {
    const targetFolder =
      await this.folderRepository.findFolderByFolderId(folderId);

    if (targetFolder.userId != userId) {
      throw new ForbiddenFolderException(
        '해당 폴더의 소유주가 아니라 권한이 없음.',
      );
    }

    if (targetFolder.type == FolderType.Default) {
      return await this.folderPlaceRepository.deleteAllFolderPlaces(placeIds);
    }

    return await this.folderPlaceRepository.deleteFolderPlaces(
      folderId,
      placeIds,
    );
  }

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

  async getMarkers(
    userId: number,
    addressList: string[],
    categoryList: string[],
    folderId?: number,
  ): Promise<MarkersListResDto> {
    const rawMarkersList = await this.folderPlaceRepository.getMarkers(
      userId,
      addressList,
      categoryList,
      folderId,
    );

    return new MarkersListResDto(rawMarkersList);
  }

  async getPlacesList(
    userId: number,
    placesListReqDto: PlacesListReqDto,
    folderId?: number,
  ): Promise<PlacesListResDto> {
    const rawPlacesInfoList = await this.folderPlaceRepository.getPlacesList(
      userId,
      placesListReqDto,
      folderId,
    );
    console.log(rawPlacesInfoList);
    return new PlacesListResDto(rawPlacesInfoList, placesListReqDto.take);
  }
}
