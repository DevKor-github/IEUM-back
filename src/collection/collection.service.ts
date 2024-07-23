import { Injectable } from '@nestjs/common';
import { CollectionPlaceRepository } from 'src/repositories/collection-place.repository';
import { CollectionRepository } from 'src/repositories/collection.repository';
import { CreateCollectionReqDto } from './dtos/create-collection-req.dto';
import { PlaceService } from 'src/place/place.service';
import { CrawlingCollectionReqDto } from './dtos/crawling-collection-req.dto';
import { UserService } from 'src/user/user.service';
import { CollectionPlacesListResDto } from './dtos/collection-places-list.dto';

@Injectable()
export class CollectionService {
  constructor(
    private readonly collectionRepository: CollectionRepository,
    private readonly collectionPlaceRepository: CollectionPlaceRepository,
    private readonly placeService: PlaceService,
    private readonly userService: UserService,
  ) {}

  async createCollection(createCollectionReq: CreateCollectionReqDto) {
    const user = await this.userService.getUserByUuid(
      createCollectionReq.userUuid,
    );
    const collection = await this.collectionRepository.createCollection(
      user.id,
      createCollectionReq.link,
      createCollectionReq.content,
    );

    createCollectionReq.placeKeywords.map(async (placeKeyword) => {
      const place = await this.placeService.createPlaceByKeyword(placeKeyword);
      await this.collectionPlaceRepository.createCollectionPlace(
        collection.id,
        place.id,
        placeKeyword,
      );
    });

    return collection;
  }

  async sendForCrawling(body: CrawlingCollectionReqDto) {
    //그냥 앱단에서 바로 크롤링 서버로 보내면 되지 않을까?
    //
    return;
  }

  //기 조회 여부에 따라 다르게 메서드 호출
  //isViewed가 false인 collection은 colleciton-place를 counting만 하고,
  //isViewed가 true인 collection은 collection-place와 JOIN하여 isSaved를 따로 카운팅.

  async getUnviewedCollections(userId: number, cursorId?: number) {
    const unviewedCollections =
      await this.collectionRepository.getUnviewedCollections(userId, cursorId);
    return unviewedCollections;
  }

  async getViewedCollections(userId: number, cursorId?: number) {
    const viewedCollections =
      await this.collectionRepository.getViewedCollections(userId, cursorId);
    return viewedCollections;
  }

  // async getCollectionDetail(collectionId: number) {
  //   const collectionDetail =
  //     await this.collectionRepository.getCollectionDetail(collectionId);
  //   return collectionDetail;
  // }

  //getCOllectionDetail 호출 시에 Transaction으로 isViewed Update.

  async getCollectionPlaces(userId: number, collectionId: number) {
    const collectionPlaces =
      await this.collectionPlaceRepository.getCollectionPlaces(collectionId);
    return new CollectionPlacesListResDto(collectionPlaces, collectionId);
  }
}
