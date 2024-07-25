import { RawCollectionPlace } from 'src/common/interfaces/raw-collection-place.interface';
import { ApiProperty } from '@nestjs/swagger';
import { listMetaDto } from './collections-list.dto';
import { addressSimplifier } from 'src/common/utils/address-simplifier.util';
import { categoryMapper } from 'src/common/utils/category-mapper.util';

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
  category: string; //Restaurant, Cafe.. etc.

  @ApiProperty()
  placeKeyword: string;

  @ApiProperty()
  isSaved: boolean;

  constructor(collectionId: number, rawCollectionPlace: RawCollectionPlace) {
    this.collectionId = collectionId;
    this.placeId = rawCollectionPlace.place_id;
    this.placeName = rawCollectionPlace.place_name;
    this.simplifiedAddress = addressSimplifier(rawCollectionPlace.address);
    this.category = categoryMapper(rawCollectionPlace.primary_category); //카테고리 매핑 아직 안함
    this.placeKeyword = rawCollectionPlace.place_keyword;
    this.isSaved = rawCollectionPlace.is_saved;
  }
}

export class CollectionPlacesListResDto {
  meta: listMetaDto; //GET /collections에서 정의한 listMeta 재활용
  data: CollectionPlaceDto[];

  constructor(rawCollectionPlaces: RawCollectionPlace[], collectionId: number) {
    this.meta = new listMetaDto(rawCollectionPlaces.length);
    this.data = rawCollectionPlaces.map(
      (rawCollectionPlace) =>
        new CollectionPlaceDto(collectionId, rawCollectionPlace),
    );
  }
}

// "place_id": 3,
//       "kakao_id": "1351221007",
//       "place_name": "카와카츠 본점",
//       "address": "서울 마포구 서교동 465-1",
//       "category": "음식점",
//       "place_keyword": "망원 카와카츠",
//       "is_saved": false
