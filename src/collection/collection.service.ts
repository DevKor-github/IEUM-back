import { Injectable, Logger } from '@nestjs/common';
import { CollectionPlaceRepository } from 'src/collection/repositories/collection-place.repository';
import { CollectionRepository } from 'src/collection/repositories/collection.repository';
import { CreateCollectionReqDto } from './dtos/create-collection-req.dto';
import { CollectionPlacesListResDto } from './dtos/collection-places-list-res.dto';
import { Transactional } from 'typeorm-transactional';
import { CollectionsListResDto } from './dtos/paginated-collections-list-res.dto';
import { throwIeumException } from 'src/common/utils/exception.util';
import { Collection } from './entities/collection.entity';
import { RawRelatedCollection } from 'src/common/interfaces/raw-related-collection.interface';
import { RelatedCollectionsListResDto } from './dtos/paginated-related-collections-list-res.dto';

@Injectable()
export class CollectionService {
  private readonly logger = new Logger(CollectionService.name);
  constructor(
    private readonly collectionRepository: CollectionRepository,
    private readonly collectionPlaceRepository: CollectionPlaceRepository,
  ) {}

  async getUnviewedCollections(
    userId: number,
    cursorId?: number,
  ): Promise<CollectionsListResDto> {
    const unviewedCollections =
      await this.collectionRepository.getUnviewedCollectionsByUserId(
        userId,
        cursorId,
      );
    return new CollectionsListResDto(unviewedCollections);
  }

  async getViewedCollections(
    userId: number,
    cursorId?: number,
  ): Promise<CollectionsListResDto> {
    const viewedCollections =
      await this.collectionRepository.getViewedCollectionsByUserId(
        userId,
        cursorId,
      );
    return new CollectionsListResDto(viewedCollections);
  }

  async getMyRelatedCollectionsByPlaceId(
    userId: number,
    placeId: number,
    cursorId?: number,
  ): Promise<RelatedCollectionsListResDto> {
    const myRelatedCollections =
      await this.collectionRepository.getMyRelatedCollectionsByPlaceId(
        userId,
        placeId,
        cursorId,
      );
    return new RelatedCollectionsListResDto(myRelatedCollections);
  }

  async getOthersRelatedCollectionsByPlaceId(
    userId: number,
    placeId: number,
    cursorId?: number,
  ): Promise<RelatedCollectionsListResDto> {
    const othersRelatedCollections =
      await this.collectionRepository.getOthersRelatedCollectionsByPlaceId(
        userId,
        placeId,
        cursorId,
      );
    return new RelatedCollectionsListResDto(othersRelatedCollections);
  }

  async getCollectionPlaceDetail(
    userId: number,
    collectionId: number,
    collectionPlaceId: number,
  ) {
    //특정 collectionPlaceId에 대해서 유저의 폴더 목록 가져와서, 각 폴더에 대해 collectionPlaceId의 포함 여부 확인
    //collectionPlaceId가 포
    // const collectionPlace =
    //   await this.collectionPlaceRepository.getCollectionPlaceDetail(
    //     collectionPlaceId,
    //   );
    // await this.collectionRepository.updateIsViewed(userId, collectionId);
    // return collectionPlace;
  }

  @Transactional()
  async getCollectionPlaces(userId: number, collectionId: number) {
    const collection = await this.collectionRepository.findOne({
      where: { id: collectionId },
    });
    if (!collection) {
      throwIeumException('COLLECTION_NOT_FOUND');
    }

    const collectionPlaces =
      await this.collectionPlaceRepository.getCollectionPlaces(collectionId);
    await this.collectionRepository.updateIsViewed(userId, collectionId);
    return new CollectionPlacesListResDto(collectionPlaces, collectionId);
  }

  async createCollectionWithDuplicationCheck(
    createCollectionReq: CreateCollectionReqDto,
  ): Promise<Collection> {
    if (
      //중복이면 그대로 리턴해주는게 맞지 않은가? 고민해보기
      await this.collectionRepository.isDuplicatedCollection(
        createCollectionReq.userId,
        createCollectionReq.link,
      )
    ) {
      throwIeumException('CONFLICTED_COLLECTION');
    }

    const collection = await this.collectionRepository.createCollection(
      createCollectionReq.userId,
      createCollectionReq.collectionType,
      createCollectionReq.link,
      createCollectionReq.content,
    );

    return collection;
  }

  async createCollectionPlace(
    collectionId: number,
    placeId: number,
    placeKeyword: string,
  ) {
    await this.collectionPlaceRepository.createCollectionPlace(
      collectionId,
      placeId,
      placeKeyword,
    );
  }

  async updateCollectionPlacesIsSavedToTrue(
    collectionId: number,
    placeIds: number[],
  ): Promise<void> {
    await Promise.all(
      placeIds.map((placeId) => {
        this.collectionPlaceRepository.updateCollectionPlaceIsSavedToTrue(
          collectionId,
          placeId,
        );
      }),
    );
  }

  async updateCollectionPlacesIsSavedToFalse(
    userId: number,
    placeIds: number[],
  ): Promise<void> {
    await Promise.all(
      placeIds.map((placeId) => {
        this.collectionPlaceRepository.updateCollectionPlacesIsSavedToFalse(
          userId,
          placeId,
        );
      }),
    );
  }
}
