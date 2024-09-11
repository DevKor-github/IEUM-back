import { Injectable, Logger } from '@nestjs/common';
import { CollectionPlaceRepository } from 'src/collection/repositories/collection-place.repository';
import { CollectionRepository } from 'src/collection/repositories/collection.repository';
import { CreateCollectionReqDto } from './dtos/create-collection-req.dto';
import { PlaceService } from 'src/place/place.service';
import { CollectionPlacesListResDto } from './dtos/collection-places-list-res.dto';
import { Transactional } from 'typeorm-transactional';
import { CollectionsListResDto } from './dtos/paginated-collections-list-res.dto';
import { throwIeumException } from 'src/common/utils/exception.util';
import { Collection } from './entities/collection.entity';
import { RawLinkedColletion } from 'src/common/interfaces/raw-linked-collection.interface';

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
      await this.collectionRepository.getUnviewedCollections(userId, cursorId);
    return new CollectionsListResDto(unviewedCollections);
  }

  async getViewedCollections(
    userId: number,
    cursorId?: number,
  ): Promise<CollectionsListResDto> {
    const viewedCollections =
      await this.collectionRepository.getViewedCollections(userId, cursorId);
    return new CollectionsListResDto(viewedCollections);
  }

  async getLinkedCollections(
    userId: number,
    placeId: number,
  ): Promise<Collection[]> {
    return await this.collectionRepository.getLinkedCollections(
      userId,
      placeId,
    );
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
}
