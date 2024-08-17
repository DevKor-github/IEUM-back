import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { CollectionPlaceRepository } from 'src/repositories/collection-place.repository';
import { CollectionRepository } from 'src/repositories/collection.repository';
import { CreateCollectionReqDto } from './dtos/create-collection-req.dto';
import { PlaceService } from 'src/place/place.service';
import { CrawlingCollectionReqDto } from '../crawling/dtos/crawling-collection-req.dto';
import { UserService } from 'src/user/user.service';
import { CollectionPlacesListResDto } from './dtos/collection-places-list-res.dto';
import { Transactional } from 'typeorm-transactional';
import { CollectionsListResDto } from './dtos/paginated-collections-list-res.dto';
import { ConflictedCollectionException } from 'src/common/exceptions/collection.exception';

@Injectable()
export class CollectionService {
  private readonly logger = new Logger(CollectionService.name);
  constructor(
    private readonly collectionRepository: CollectionRepository,
    private readonly collectionPlaceRepository: CollectionPlaceRepository,
    private readonly placeService: PlaceService,
    private readonly userService: UserService,
  ) {}

  @Transactional()
  async createCollection(createCollectionReq: CreateCollectionReqDto) {
    try {
      if (
        await this.collectionRepository.isDuplicatedCollection(
          createCollectionReq.userId,
          createCollectionReq.link,
        )
      ) {
        throw new ConflictedCollectionException('이미 저장한 게시글이에요!');
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
            await this.placeService.createPlaceByKakao(placeKeyword);
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

  async sendForCrawling(body: CrawlingCollectionReqDto) {
    return;
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
