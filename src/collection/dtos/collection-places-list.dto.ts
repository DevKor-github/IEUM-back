import { RawCollectionPlace } from 'src/common/interfaces/raw-collection-place.interface';
import { ApiProperty } from '@nestjs/swagger';
import { listMetaDto } from './collections-list.dto';

export class CollectionPlaceDto {
  @ApiProperty()
  collectionId: number;

  @ApiProperty()
  placeId: number;

  @ApiProperty()
  kakaoId: string;

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
    this.placeId = rawCollectionPlace.placeId;
    this.kakaoId = rawCollectionPlace.kakaoId;
    this.placeName = rawCollectionPlace.placeName;
    this.simplifiedAddress = this.addressSimplifier(rawCollectionPlace.address);
    this.category = rawCollectionPlace.primaryCategory; //카테고리 매핑 아직 안함
    this.placeKeyword = rawCollectionPlace.placeKeyword;
    this.isSaved = rawCollectionPlace.isSaved;
  }

  private addressSimplifier(address: string): string {
    const addressArray = address.split(' ');
    const simplifiedAddressParts = addressArray.slice(0, 2);
    return simplifiedAddressParts.join(' ');
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
