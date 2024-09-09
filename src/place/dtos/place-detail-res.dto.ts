import { ApiProperty } from '@nestjs/swagger';
import { addressSimplifier } from 'src/common/utils/address-simplifier.util';
import { categoryMapper } from 'src/common/utils/category-mapper.util';
import { tagParser } from 'src/common/utils/tag-parser.util';
import { Place } from 'src/place/entities/place.entity';

export class PlaceDetailResDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  simplifiedAddress: string; //간략 주소

  @ApiProperty()
  primaryCategory: string;

  //CustomTagParser
  // customTags : string[];

  @ApiProperty()
  openingHours: string[];

  @ApiProperty()
  phone: string;

  /*
  placeDetail을 JOIN
  offeredServices
  parkingOptions
  allowsDogs
  goodForGroups
  takeout
  delivery
  reservable
   */

  @ApiProperty()
  latitude: number; //위도

  @ApiProperty()
  longitude: number; //경도

  @ApiProperty()
  address: string; //지번 주소

  @ApiProperty()
  roadAddress: string;

  /*
  내가 연결한 게시글
  Collection - CollectionPlace - Place를 JOIN
  userId, placeId로 SELECT
  */

  /*
  @ApiProperty()
  이미지 정보
  placeImage를 JOIN
  {
    url
    author
    source
  }
  */

  constructor(placeDetail: Place) {
    const { locationTags, categoryTags } = tagParser(placeDetail.placeTags);

    this.id = placeDetail.id;
    this.name = placeDetail.name;
    this.simplifiedAddress = addressSimplifier(placeDetail.address);
    this.address = placeDetail.address;
    this.roadAddress = placeDetail.roadAddress;
    this.phone = placeDetail.phone;
    this.latitude = placeDetail.latitude;
    this.longitude = placeDetail.longitude;
  }
  //이하는 placeDetail에 포함된 부분. 확정 X
}
