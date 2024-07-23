import { ApiProperty } from '@nestjs/swagger';
import { listMetaDto } from './collections-list.dto';

export class CollectionPlaceDto {
  @ApiProperty()
  id: number;

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
  primaryCategory: string; //Restaurant, Cafe.. etc.
}

export class CollectionPlacesListResDto {
  meta: listMetaDto; //GET /collections에서 정의한 listMeta 재활용
  data: CollectionPlaceDto[];
}
