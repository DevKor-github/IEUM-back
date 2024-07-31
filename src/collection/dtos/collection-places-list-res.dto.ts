import { RawCollectionPlace } from 'src/common/interfaces/raw-collection-place.interface';
import { ApiProperty } from '@nestjs/swagger';
import { addressSimplifier } from 'src/common/utils/address-simplifier.util';
import { categoryMapper } from 'src/common/utils/category-mapper.util';
import {
  createNormalList,
  NormalListMeta,
} from 'src/common/utils/normal-list.util';

export class CollectionPlaceDto {
  @ApiProperty()
  collectionId: number;

  @ApiProperty()
  placeId: number;

  @ApiProperty()
  placeName: string;

  @ApiProperty()
  simplifiedAddress: string; //제주 서귀포시

  @ApiProperty()
  mappedCategory: string; //Restaurant, Cafe.. etc.

  @ApiProperty()
  placeKeyword: string;

  @ApiProperty()
  isSaved: boolean;

  constructor(collectionId: number, rawCollectionPlace: RawCollectionPlace) {
    this.collectionId = collectionId;
    this.placeId = rawCollectionPlace.place_id;
    this.placeName = rawCollectionPlace.place_name;
    this.simplifiedAddress = addressSimplifier(rawCollectionPlace.address);
    this.mappedCategory = categoryMapper(rawCollectionPlace.primary_category);
    this.placeKeyword = rawCollectionPlace.place_keyword;
    this.isSaved = rawCollectionPlace.is_saved;
  }
}

export class CollectionPlacesListResDto {
  meta: NormalListMeta<RawCollectionPlace>; //GET /collections에서 정의한 listMeta 재활용
  data: CollectionPlaceDto[];

  constructor(rawCollectionPlaces: RawCollectionPlace[], collectionId: number) {
    const { meta, data } = createNormalList(
      rawCollectionPlaces,
      (rawCollectionPlace) =>
        new CollectionPlaceDto(collectionId, rawCollectionPlace),
    );

    this.meta = meta;
    this.data = data;
  }
}
