import { Injectable } from '@nestjs/common';
import { CollectionService } from 'src/collection/collection.service';
import { PlaceDetailResDto } from 'src/place/dtos/place-detail-res.dto';
import { PlaceService } from 'src/place/services/place.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PlaceComplexService {
  constructor(
    private readonly placeService: PlaceService,
    private readonly collectionService: CollectionService,
  ) {}

  async getPlaceDetailWithImagesAndCollectionsById(
    userId: number,
    placeId: number,
  ): Promise<PlaceDetailResDto> {
    const placeDetail = await this.placeService.getPlaceDetailById(placeId);
    const placeImages =
      await this.placeService.getPlaceImagesByPlaceId(placeId);
    const linkedCollections = await this.collectionService.getLinkedCollections(
      userId,
      placeId,
    );
    const ieumCategory = await this.placeService.getIeumCategoryByKakaoCategory(
      placeDetail.primaryCategory,
    );
    return new PlaceDetailResDto(
      placeDetail,
      placeImages,
      linkedCollections,
      ieumCategory,
    );
  }
}
