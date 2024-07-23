import { Injectable } from '@nestjs/common';
import { CollectionPlaceRepository } from 'src/repositories/collection-place.repository';
import { CollectionRepository } from 'src/repositories/collection.repository';
import { CreateCollectionReqDto } from './dtos/create-collection-req.dto';
import { PlaceService } from 'src/place/place.service';
import { CrawlingCollectionReqDto } from './dtos/crawling-collection-req.dto';
import { UserService } from 'src/user/user.service';

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

  async getCollections(userId: number) {
    const collections = await this.collectionRepository.getCollections(userId);
    return collections;
  }
}
