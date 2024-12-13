import { Injectable } from '@nestjs/common';
import { CollectionService } from 'src/collection/collection.service';
import { RelatedCollectionsListResDto } from 'src/collection/dtos/paginated-related-collections-list-res.dto';
import { FolderInfoWithPlaceExistence } from 'src/common/interfaces/raw-folder-info.interface';
import { FoldersWithPlaceExistenceListResDto } from 'src/folder/dtos/folders-list.res.dto';
import { FolderService } from 'src/folder/folder.service';
import { PlaceDetailResDto } from 'src/place/dtos/place-detail-res.dto';
import { PlaceService } from 'src/place/services/place.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PlaceComplexService {
  constructor(
    private readonly placeService: PlaceService,
    private readonly collectionService: CollectionService,
    private readonly folderService: FolderService,
  ) {}

  async getPlaceDetailWithImagesAndCollectionsById(
    userId: number,
    placeId: number,
  ): Promise<PlaceDetailResDto> {
    const placeDetail = await this.placeService.getPlaceDetailById(placeId);
    const placeImages =
      await this.placeService.getPlaceImagesByPlaceId(placeId);
    const myRelatedCollections: RelatedCollectionsListResDto =
      await this.collectionService.getMyRelatedCollectionsByPlaceId(
        userId,
        placeId,
      );
    const defaultFolder = await this.folderService.getDefaultFolder(userId);
    const isFolderIncludingPlace =
      await this.folderService.checkFolderPlaceExistence(
        defaultFolder.id,
        placeId,
      );
    const ieumCategory = await this.placeService.getIeumCategoryByKakaoCategory(
      placeDetail.primaryCategory,
    );
    return new PlaceDetailResDto(
      placeDetail,
      placeImages,
      myRelatedCollections.items,
      ieumCategory,
      isFolderIncludingPlace,
    );
  }

  async getFoldersListWithPlaceExistence(userId: number, placeId: number) {
    const place =
      await this.placeService.getPlaceByIdWithCheckingStatus(placeId);
    const userFolders = await this.folderService.getAllFoldersList(userId);
    const foldersListWithPlaceExistence: FolderInfoWithPlaceExistence[] =
      await Promise.all(
        userFolders.map(async (folder) => {
          const isFolderIncludingPlace =
            await this.folderService.checkFolderPlaceExistence(
              folder.id,
              place.id,
            );
          return {
            id: folder.id,
            name: folder.name,
            type: folder.type,
            userId: folder.userId,
            placeCnt: folder.placeCnt,
            placeExistence: isFolderIncludingPlace,
          };
        }),
      );

    return new FoldersWithPlaceExistenceListResDto(
      foldersListWithPlaceExistence,
    );
    // placeId의 유효성 체크
    // userId로 유저가 가진 폴더 가져오기 (디폴트, 사용자 생성 각각)
    // 각 폴더에 대해 folderPlaceRepository에서 folderId, placeId로 포함 여부 체크
    // 폴더, 폴더명, 폴더에 대한 포함 여부 반환(boolean)
  }

  async getRelatedCollectionsFromOthers(
    userId: number,
    placeId: number,
    cursorId?: number,
  ): Promise<RelatedCollectionsListResDto> {
    const RelatedCollectionsFromOthers: RelatedCollectionsListResDto =
      await this.collectionService.getOthersRelatedCollectionsByPlaceId(
        userId,
        placeId,
        cursorId,
      );
    return RelatedCollectionsFromOthers;
  }
}
