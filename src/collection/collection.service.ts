import { Injectable, Logger } from '@nestjs/common';
import { CollectionPlaceRepository } from 'src/collection/repositories/collection-place.repository';
import { CollectionRepository } from 'src/collection/repositories/collection.repository';
import { CreateCollectionReqDto } from './dtos/create-collection-req.dto';
import { PlaceService } from 'src/place/place.service';
import { CollectionPlacesListResDto } from './dtos/collection-places-list-res.dto';
import { Transactional } from 'typeorm-transactional';
import { CollectionsListResDto } from './dtos/paginated-collections-list-res.dto';
import { throwIeumException } from 'src/common/utils/exception.util';

@Injectable()
export class CollectionService {
  private readonly logger = new Logger(CollectionService.name);
  constructor(
    private readonly collectionRepository: CollectionRepository,
    private readonly collectionPlaceRepository: CollectionPlaceRepository,
    private readonly placeService: PlaceService,
  ) {}

  @Transactional() //Transactional의 정상적인 작동 의심.
  async createCollection(createCollectionReq: CreateCollectionReqDto) {
    try {
      if (
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

      await Promise.all(
        createCollectionReq.placeKeywords.map(async (placeKeyword) => {
          const place =
            await this.placeService.createPlaceByKakaoLocal(placeKeyword);
          await this.collectionPlaceRepository.createCollectionPlace(
            collection.id,
            place.id,
            placeKeyword,
          );
        }),
      );

      return collection;
    } catch (e) {
      this.logger.error(e.message, e.stack);
    }
  }

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

  @Transactional()
  async getCollectionPlaces(userId: number, collectionId: number) {
    const collectionPlaces =
      await this.collectionPlaceRepository.getCollectionPlaces(collectionId);
    await this.collectionRepository.updateIsViewed(userId, collectionId);
    return new CollectionPlacesListResDto(collectionPlaces, collectionId);
  }
}
