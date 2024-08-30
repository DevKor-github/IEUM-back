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
  url: string;

  @ApiProperty()
  simplifiedAddress: string; //간략 주소

  @ApiProperty()
  address: string; //지번 주소

  @ApiProperty()
  roadAddress: string;

  @ApiProperty()
  kakaoId: string; //식별을 위한 kakaoId

  @ApiProperty()
  phone: string;

  @ApiProperty()
  mappedCateogory: string; //이음 카테고리

  @ApiProperty()
  latitude: number; //위도

  @ApiProperty()
  longitude: number; //경도

  @ApiProperty()
  locationTags: string[]; //위치 태그

  @ApiProperty()
  categoryTags: string[]; //카테고리 태그

  @ApiProperty()
  imageUrls: string[]; //이미지 URL

  constructor(placeDetail: Place) {
    const { locationTags, categoryTags } = tagParser(placeDetail.placeTags);

    this.id = placeDetail.id;
    this.name = placeDetail.name;
    this.url = placeDetail.url;
    this.simplifiedAddress = addressSimplifier(placeDetail.address);
    this.address = placeDetail.address;
    this.roadAddress = placeDetail.roadAddress;
    this.kakaoId = placeDetail.kakaoId;
    this.phone = placeDetail.phone;
    this.mappedCateogory = categoryMapper(placeDetail.primaryCategory);
    this.latitude = placeDetail.latitude;
    this.longitude = placeDetail.longitude;
    this.locationTags = locationTags;
    this.categoryTags = categoryTags;
    this.imageUrls = placeDetail.placeImages.map((image) => image.url);
  }
  //이하는 placeDetail에 포함된 부분. 확정 X
}
