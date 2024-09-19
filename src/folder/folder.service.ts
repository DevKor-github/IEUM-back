import { Injectable, Logger } from '@nestjs/common';
import { FolderPlaceRepository } from 'src/folder/repositories/folder-place.repository';
import { FolderRepository } from 'src/folder/repositories/folder.repository';
import { FolderResDto, FoldersListResDto } from './dtos/folders-list.res.dto';
import { CreateFolderReqDto } from './dtos/create-folder-req.dto';
import { FolderType } from 'src/common/enums/folder-type.enum';
import {
  MarkerResDto,
  MarkersListResDto,
} from 'src/place/dtos/markers-list-res.dto';
import { PlacesListReqDto } from 'src/place/dtos/places-list-req.dto';
import { CreateFolderPlacesReqDto } from './dtos/create-folder-place-req.dto';

import { Transactional } from 'typeorm-transactional';
import { CreateFolderPlaceResDto } from './dtos/create-folder-place-res.dto';
import { PlacesListResDto } from 'src/place/dtos/paginated-places-list-res.dto';
import { throwIeumException } from 'src/common/utils/exception.util';
import { CATEGORIES_MAPPING_KAKAO } from 'src/common/utils/category-mapper.util';
import { Folder } from './entities/folder.entity';
import { PlaceService } from 'src/place/place.service';

@Injectable()
export class FolderService {
  private readonly logger = new Logger(FolderService.name);

  constructor(
    private readonly folderRepository: FolderRepository,
    private readonly folderPlaceRepository: FolderPlaceRepository,
    private readonly placeService: PlaceService,
  ) {}

  // ------폴더 관련 메서드------
  async getFoldersList(userId: number): Promise<FoldersListResDto> {
    const rawFoldersList = await this.folderRepository.getFoldersList(userId);
    const foldersList = new FoldersListResDto(rawFoldersList);
    return foldersList;
  }

  async getFolderByFolderId(folderId: number): Promise<FolderResDto> {
    const folder = await this.folderRepository.getFolderByFolderId(folderId);
    return new FolderResDto(folder);
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

  async getMarkers(
    userId: number,
    addressList: string[],
    categoryList: string[],
    folderId?: number,
  ): Promise<MarkersListResDto> {
    if (folderId) {
      const folder = await this.folderRepository.getFolderByFolderId(folderId);
      if (!folder) {
        throwIeumException('FOLDER_NOT_FOUND');
      }
      if (folder.userId !== userId) {
        throwIeumException('FORBIDDEN_FOLDER');
      }
    }
    const mappedCategories = categoryList.reduce((acc, category) => {
      const mappedCategory = CATEGORIES_MAPPING_KAKAO[category] || [];
      return acc.concat(mappedCategory);
    }, []);
    const rawMarkersList = await this.folderPlaceRepository.getMarkers(
      userId,
      addressList,
      mappedCategories,
      folderId,
    );

    return new MarkersListResDto(rawMarkersList);
  }

  async getPlacesList(
    userId: number,
    placesListReqDto: PlacesListReqDto,
    folderId?: number,
  ): Promise<PlacesListResDto> {
    if (folderId) {
      const folder = await this.folderRepository.getFolderByFolderId(folderId);
      if (!folder) {
        throwIeumException('FOLDER_NOT_FOUND');
      }
      if (folder.userId !== userId) {
        throwIeumException('FORBIDDEN_FOLDER');
      }
    }
    const { take, cursorId, addressList, categoryList } = placesListReqDto;
    const mappedCategories = categoryList.reduce((acc, category) => {
      const mappedCategory = CATEGORIES_MAPPING_KAKAO[category] || [];
      return acc.concat(mappedCategory);
    }, []);
    const rawPlacesInfoList = await this.folderPlaceRepository.getPlacesList(
      userId,
      take,
      addressList,
      mappedCategories,
      cursorId,
      folderId,
    );
    return new PlacesListResDto(rawPlacesInfoList, placesListReqDto.take);
  }

  async createFolderPlacesIntoFolder(
    //기본 Folder-place 저장 로직
    userId: number,
    createFolderPlacesReqDto: CreateFolderPlacesReqDto,
    folderId: number,
  ) {
    const placeIds = createFolderPlacesReqDto.placeIds;

    const folder = await this.folderRepository.getFolderByFolderId(folderId);
    if (!folder) {
      throwIeumException('FOLDER_NOT_FOUND');
    }
    if (folder.userId !== userId) {
      throwIeumException('FORBIDDEN_FOLDER');
    }
    //placeId에 대한 유효성 체크가 가능한가? -> placeService 주입.
    //
    await Promise.all(
      placeIds.map(async (placeId) => {
        const place = await this.placeService.getPlaceDetailById(placeId); // 내부에서 유효성 체크 일어난다.
        if (!place.placeDetail) {
          // 만약 이 내부에서 fail이 일어나면 어떻게 처리할 것인가?
          try {
            await this.placeService.createPlaceDetailByGooglePlacesApi(placeId);
          } catch (error) {
            this.logger.error(
              `Failed to create PlaceDetail By placeId : ${placeId}`,
            );
          }
        }
        await this.folderPlaceRepository.createFolderPlace(folderId, placeId);
      }),
    );
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

  @Transactional()
  async deleteFolderPlaces(
    userId: number,
    folderId: number,
    placeIds: number[],
  ) {
    const targetFolder =
      await this.folderRepository.getFolderByFolderId(folderId);
    if (!targetFolder) {
      throwIeumException('FOLDER_NOT_FOUND');
    }
    if (targetFolder.userId != userId) {
      throwIeumException('FORBIDDEN_FOLDER');
    }

    if (targetFolder.type == FolderType.Default) {
      //디폴트 폴더라면, 나머지 폴더에서도 전부 삭제
      const foldersList = await this.folderRepository.getFoldersList(userId);
      foldersList.forEach(async (folder) => {
        await this.folderPlaceRepository.deleteFolderPlaces(
          folder.id,
          placeIds,
        );
      });
    }

    return await this.folderPlaceRepository.deleteFolderPlaces(
      //해당 폴더에서 삭제
      folderId,
      placeIds,
    );
  }
}
