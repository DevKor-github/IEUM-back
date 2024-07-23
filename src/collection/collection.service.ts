import { Injectable } from '@nestjs/common';
import { CollectionPlaceRepository } from 'src/repositories/collection-place.repository';
import { CollectionRepository } from 'src/repositories/collection.repository';
import { CreateCollectionReqDto } from './dtos/create-collection-req.dto';
import { PlaceService } from 'src/place/place.service';

@Injectable()
export class CollectionService {
  constructor(
    private readonly collectionRepository: CollectionRepository,
    private readonly collectionPlaceRepository: CollectionPlaceRepository,
    private readonly placeService: PlaceService,
  ) {}

  async createCollections(body: CreateCollectionReqDto[]) {
    for (const createCollectionReq of body) {
      const collection =
        await this.collectionRepository.createCollection(createCollectionReq);
      const place = await this.placeService.createPlaceByKeyword(
        createCollectionReq.placeKeyword,
      );
      await this.collectionPlaceRepository.createCollectionPlace(
        collection.id,
        place.id,
      );
    }
  }
}
