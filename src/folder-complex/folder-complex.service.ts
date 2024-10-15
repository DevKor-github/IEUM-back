import { Injectable, Logger } from '@nestjs/common';
import { FolderType } from 'src/common/enums/folder-type.enum';
import { throwIeumException } from 'src/common/utils/exception.util';
import { CreateFolderPlacesReqDto } from 'src/folder/dtos/create-folder-place-req.dto';
import { CreateFolderPlaceResDto } from 'src/folder/dtos/create-folder-place-res.dto';
import { FolderService } from 'src/folder/folder.service';
import { MarkersListResDto } from 'src/place/dtos/markers-list-res.dto';
import { PlacesListResDto } from 'src/place/dtos/paginated-places-list-res.dto';
import {
  MarkersReqDto,
  PlacesListReqDto,
} from 'src/place/dtos/places-list-req.dto';
import { PlaceService } from 'src/place/services/place.service';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class FolderComplexService {
  private readonly logger = new Logger(FolderComplexService.name);
  constructor(
    private readonly folderService: FolderService,
    private readonly placeService: PlaceService,
  ) {}

  async getMarkers(
    userId: number,
    markersReqDto: MarkersReqDto,
    folderId?: number,
  ): Promise<MarkersListResDto> {
    if (folderId) {
      await this.folderService.getRawFolderByIdWithCheckingStatus(
        userId,
        folderId,
      );
    }
    const { addressList, categoryList } = markersReqDto;
    const kakaoCategoriesForFiltering = await Promise.all(
      categoryList.map(async (category) => {
        return await this.placeService.getKakaoCategoriesByIeumCategory(
          category,
        );
      }),
    );
    const rawMarkersList = await this.folderService.getRawMarkers(
      userId,
      addressList,
      kakaoCategoriesForFiltering.flat(),
      folderId,
    );

    await Promise.all(
      rawMarkersList.map(async (marker) => {
        marker.ieumCategory =
          await this.placeService.getIeumCategoryByKakaoCategory(
            marker.primary_category,
          );
        return marker; // 이 반환값은 실제로 사용되지 않지만, 명시적으로 표현
      }),
    );

    return new MarkersListResDto(rawMarkersList);
  }

  async getPlacesList(
    userId: number,
    placesListReqDto: PlacesListReqDto,
    folderId?: number,
  ): Promise<PlacesListResDto> {
    if (folderId) {
      await this.folderService.getRawFolderByIdWithCheckingStatus(
        userId,
        folderId,
      );
    }
    const { take, cursorId, addressList, categoryList } = placesListReqDto;
    const kakaoCategoriesForFiltering = await Promise.all(
      categoryList.map(async (category) => {
        return await this.placeService.getKakaoCategoriesByIeumCategory(
          category,
        );
      }),
    );

    const rawPlacesInfoList = await this.folderService.getRawPlacesList(
      userId,
      take,
      addressList,
      kakaoCategoriesForFiltering.flat(),
      cursorId,
      folderId,
    );

    await Promise.all(
      rawPlacesInfoList.map(async (placeInfo) => {
        placeInfo.ieumCategory =
          await this.placeService.getIeumCategoryByKakaoCategory(
            placeInfo.primary_category,
          );
        return placeInfo; // 이 반환값은 실제로 사용되지 않지만, 명시적으로 표현
      }),
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
    await this.folderService.getRawFolderByIdWithCheckingStatus(
      userId,
      folderId,
    );
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
        await this.folderService.createFolderPlace(folderId, placeId);
      }),
    );
  }

  @Transactional()
  async createFolderPlacesIntoDefaultFolder(
    // Default 폴더에만 저장할 때 호출되는 메서드
    userId: number,
    createFolderPlacesReqDto: CreateFolderPlacesReqDto,
  ): Promise<CreateFolderPlaceResDto> {
    const defaultFolder = await this.folderService.getDefaultFolder(userId);
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
      await this.folderService.getRawFolderByIdWithCheckingStatus(
        userId,
        folderId,
      );

    if (targetFolder.type == FolderType.Default) {
      //디폴트 폴더라면, 나머지 폴더에서도 전부 삭제
      const foldersList = await this.folderService.getRawFoldersList(userId);
      foldersList.forEach(async (folder) => {
        await this.folderService.deleteFolderPlaces(folder.id, placeIds);
      });
    }

    return await this.folderService.deleteFolderPlaces(
      //해당 폴더에서 삭제
      folderId,
      placeIds,
    );
  }
}
