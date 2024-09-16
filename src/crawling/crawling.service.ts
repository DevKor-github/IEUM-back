import { Injectable, Logger } from '@nestjs/common';
import { CollectionService } from 'src/collection/collection.service';
import { CreateCollectionReqDto } from 'src/collection/dtos/create-collection-req.dto';
import { throwIeumException } from 'src/common/utils/exception.util';
import { PlaceService } from 'src/place/place.service';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class CrawlingService {
  private readonly logger = new Logger();

  constructor(
    private readonly collectionService: CollectionService,
    private readonly placeService: PlaceService,
  ) {}

  @Transactional() //Transactional의 정상적인 작동 의심.
  async createCollection(createCollectionReq: CreateCollectionReqDto) {
    try {
      console.log('createCollection at crawlingService', createCollectionReq);
      const collection =
        await this.collectionService.createCollectionWithDuplicationCheck(
          createCollectionReq,
        );

      await Promise.all(
        createCollectionReq.placeKeywords.map(async (placeKeyword) => {
          const place =
            await this.placeService.createPlaceByKakaoLocal(placeKeyword);
          await this.collectionService.createCollectionPlace(
            collection.id,
            place.id,
            placeKeyword,
          );
        }),
      );
      return collection;
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throwIeumException('CREATE_COLLECTION_FAILED');
    }
  }
}
